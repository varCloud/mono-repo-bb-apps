import { Injectable } from '@angular/core';
import {
  PushNotifications,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';
import { isPlatform, ToastController } from '@ionic/angular';
import { LoggerService } from '../../services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  constructor(
    private logger: LoggerService,
    private toastController: ToastController,
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
      PushNotifications.addListener('registration', (token: Token) => {
        console.log('Push registration success, token: ', token.value);
        this.logger.info('Push registration success', { token: token.value });
        // Aquí debes enviar este token al backend
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
