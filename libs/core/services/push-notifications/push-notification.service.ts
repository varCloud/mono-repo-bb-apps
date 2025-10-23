import { Injectable } from '@angular/core';
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
        this.updatePushTokenIfSessionActive(token.value);
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
      PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (notification) => {
          this.logger.info('Push notification action performed', notification);
        },
      );
    }
  }

  /**
   * Actualiza el token push si hay sesión activa y userId válido
   */
  public async updatePushTokenIfSessionActive(token: string): Promise<void> {
    // Obtener usuario actual (puede ser signal o promesa)
    let user = this._sesionService.user$?.();
    if (!user) {
      user = await this._sesionService.getUserFromLocalStorage();
    }
    if (user && user.userId) {
       const payload = {
        pushNotificationToken: await this._localStorage.get(KEY_LOCALSTORAGE.TOKEN_PUSH) || '',
      };

      this.logger.info('Actualizando token push para usuario', { userId: user.userId, token });
      this._userService.updateUser(user.userId, payload).pipe(take(1)).subscribe({
        next: () => {
          this.logger.info('Token push actualizado correctamente para usuario', { userId: user.userId }); 
        },
        error: (error) => {
          this.logger.error('Error al actualizar token push para usuario', { userId: user.userId, error });
        }
      });
    } else {
      this.logger.info('No hay sesión activa, no se actualiza el token push');
    }
  }

  private async showForegroundNotification(
    notification: PushNotificationSchema,
  ) {
    const toast = await this.toastController.create({
      header: notification.title,
      message: notification.body,
      position: 'top',
      duration: 3000,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
        },
      ],
    });

    await toast.present();
  }
}
