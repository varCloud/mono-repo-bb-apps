import { Injectable, NgZone } from '@angular/core';
import {
  PushNotifications,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';
import { isPlatform, ToastController } from '@ionic/angular';
import { LoggerService } from '../../services/logger.service';
import { LocalStorageService } from '../local-storage.service';
import { KEY_LOCALSTORAGE } from 'libs/shared/constants/key-localstorage';
import { SesionService } from '../sesion.service';
import { UserService } from '../user.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  constructor(
    private logger: LoggerService,
    private toastController: ToastController,
    private _localStorage: LocalStorageService,
    private _sesionService: SesionService,
    private _userService: UserService,
    private _zone: NgZone,
    private _router: Router,

  ) {}

  public initPushNotifications() {
    console.log('Initializing push notifications...');
    if (isPlatform('capacitor')) {
      console.log('Platform is Capacitor, setting up push notifications.');
      PushNotifications.requestPermissions().then((result) => {
        if (result.receive === 'granted') {
           PushNotifications.register();
        } else {
            this.logger.info('Permisos no concedidos para notificaciones push');
        }
      });

      // Registra el dispositivo para recibir notificaciones
      PushNotifications.addListener('registration', async (token: Token) => {
        console.log('Push registration success, token: ', token.value);
        this.logger.info('Push registration success', { token: token.value });
        await this._localStorage.set(KEY_LOCALSTORAGE.TOKEN_PUSH, token.value);
        this._userService.updatePushTokenIfSessionActive();
      });

      // Listener para notificaciones recibidas en primer plano
      PushNotifications.addListener(
        'pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          this.logger.info('Push notification received', notification);
          this.showForegroundNotification(notification);
        },
      );

      // Listener para notificaciones tocadas por el usuario
      PushNotifications.addListener('pushNotificationActionPerformed',(notification) => {
          this.logger.info('Notificación recibida por interacción', notification);
          this.logger.info('Push notification action performed', notification);
          const data = notification.notification.data;
          this.logger.info('Push notification data:', data);
          this._zone.run(() => {
            const url = `/home/${data.userConversationId}/user-chat`;
          this._router.navigate([url] , { state: { data } });
          
        });
        },
      );
    }
  }


  private handleNotificationTap(notification: PushNotificationSchema) {
    // Aquí puedes agregar la lógica para manejar el tap en la notificación
    // Por ejemplo, navegar a una página específica, actualizar datos, etc.
    this.logger.info('Manejando tap en notificación', notification);
  }

  private async showForegroundNotification(notification: PushNotificationSchema) {
    const toast = await this.toastController.create({
      header: notification.title,
      message: notification.body,
      position: 'top',
      duration: 3000,
      cssClass: "interactive-toast",
      animated: true
    });

    // Suscribirse al evento de tap
    toast.addEventListener('click', () => {
      this.handleNotificationTap(notification);
      toast.dismiss();
    });

    await toast.present();
  }
}
