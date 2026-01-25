import { CONSTANTS } from './../../../shared/constants/constants';
import { ENUM_TYPE_PUSH_NOTIFICATION } from './../../../shared/constants/enums';
import { Injectable, NgZone } from '@angular/core';
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { isPlatform, ToastController, AlertController } from '@ionic/angular';
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
  private lastNotificationTime = 0;
  private readonly NOTIFICATION_THROTTLE_MS = 3000; // 3 segundos entre notificaciones

  constructor(
    private logger: LoggerService,
    private toastController: ToastController,
    private alertController: AlertController,
    private _localStorage: LocalStorageService,
    private _sesionService: SesionService,
    private _userService: UserService,
    private _zone: NgZone,
    private _router: Router
  ) {}

  public initPushNotifications() {
    console.log('Initializing push notifications...');
    if (isPlatform('capacitor')) {
      console.log('Platform is Capacitor, setting up push notifications.');
      
      // Pedir permisos para local notifications
      this.requestLocalNotificationsPermissions();

      PushNotifications.requestPermissions().then((result) => {
        console.log(result);
        if (result.receive === 'granted') {
          console.log(
            'Push notification permissions granted.**************************'
          );
          this.logger.info('Permisos concedidos para notificaciones push');
          PushNotifications.register();
        } else {
          this.logger.info('Permisos NO concedidos para notificaciones push');
        }
      });

      //Registra el dispositivo para recibir notificaciones
      PushNotifications.addListener('registration', async (token: Token) => {
        console.log('Push registration success, token: ', token.value);
        this.logger.info('Push registration success', { token: token.value });
        await this._localStorage.set(KEY_LOCALSTORAGE.TOKEN_PUSH, token.value);
        this._userService.updatePushTokenIfSessionActive();
      });

      // Listener para notificaciones recibidas en primer plano
      PushNotifications.addListener('pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          this.logger.info('Push notification received', notification);
          this.showForegroundNotification(notification);
        }
      );

      // Listener para notificaciones tocadas por el usuario
      PushNotifications.addListener( 'pushNotificationActionPerformed',(notification : ActionPerformed) => {
          this.logger.info('Notificación recibida por toque del usuario', notification);
          this._zone.run(() => {
           this.handleNotificationTap(notification.notification);
          });
        }
      );

      // Listener para cuando se toca una notificación local
      LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
        this.logger.info('Local notification tapped', notification);
        this._zone.run(() => {
          const notificationData = JSON.parse(notification.notification.extra.originalData);
          this.handleNotificationTap(notificationData);
        });
      });
    }
  }

  private async requestLocalNotificationsPermissions() {
    try {
      const permissions = await LocalNotifications.requestPermissions();
      this.logger.info('Local notifications permissions:', permissions);
      
      if (permissions.display === 'granted') {
        this.logger.info('Permisos concedidos para notificaciones locales');
        // Crear canal de notificación para chat
        await this.createNotificationChannel();
      } else {
        this.logger.warning('Permisos NO concedidos para notificaciones locales:', permissions.display);
      }
      
      return permissions;
    } catch (error) {
      this.logger.error('Error requesting local notifications permissions:', error);
      return null;
    }
  }

  private handleNotificationTap(notification: PushNotificationSchema) {
    this.logger.info('Manejando tap en notificación', notification);
    const conversation =  JSON.parse(notification.data.conversation)
    console.log('Conversation data on tap:', JSON.stringify(conversation))
    this.redirectToConversation(conversation);
  }

  private redirectToConversation(conversation: any) {
      this._zone.run(() => {
          const url = `/home/${conversation.conversationId}/user-chat`;
          console.log('Navigating to:', url, 'with data:', conversation);
          this._router.navigate([url], { state: { conversation: conversation , fromPush:true } , replaceUrl:true });
    });
  }

    private async createNotificationChannel() {
    try {
      await LocalNotifications.createChannel({
        id: 'chat_messages',
        name: 'Mensajes de Chat',
        description: 'Notificaciones de nuevos mensajes',
        sound: 'default',
        importance: 4, // High importance
        visibility: 1, // Public
        lights: true,
        lightColor: '#25d366',
        vibration: true
      });
      
      this.logger.info('Notification channel created');
    } catch (error) {
      this.logger.error('Error creating notification channel:', error);
    }
  }

  private async showForegroundNotification(notification: PushNotificationSchema ) {

    // Throttling: evitar notificaciones muy frecuentes
    const now = Date.now();
    if (now - this.lastNotificationTime < this.NOTIFICATION_THROTTLE_MS) {
      this.logger.info('Notification throttled to avoid spam');
      return;
    }
    this.lastNotificationTime = now;
    let imageUrl = CONSTANTS.DEFAULT_ONLY_LOGO;
    switch (Number(notification.data?.notificationType)) {
      case ENUM_TYPE_PUSH_NOTIFICATION.CHAT_MESSAGE:
              imageUrl = notification.data?.profilePictureReceivesUrl || CONSTANTS.DEFAULT_URL_AVATAR;
              this.showNotification(notification, imageUrl);        
      break;
      case ENUM_TYPE_PUSH_NOTIFICATION.INFORMATION:
              this.showNotification(notification, imageUrl);        
      break;
    }

  }

  private async showNotification(notification: PushNotificationSchema, imageUrl: string) {
    // Crear elemento HTML personalizado tipo WhatsApp
    const notificationElement = document.createElement('div');
    notificationElement.className = 'whatsapp-notification-overlay';
    notificationElement.innerHTML = `
      <div class="whatsapp-notification-container">
        <div class="whatsapp-notification-content">
          <img src="${imageUrl}" class="whatsapp-avatar" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%23ddd%22/><text x=%2250%22 y=%2260%22 text-anchor=%22middle%22 font-size=%2240%22 fill=%22%23999%22>?</text></svg>'" />
          <div class="whatsapp-content">
            <div class="whatsapp-sender">${notification.title}</div>
            <div class="whatsapp-message">${notification.body}</div>
            <div class="whatsapp-time">${new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}</div>
          </div>
        </div>
      </div>
    `;

    // Agregar al DOM
    document.body.appendChild(notificationElement);

    // Agregar event listener para click
    notificationElement.addEventListener('click', () => {
      this.handleNotificationTap(notification);
      this.dismissWhatsAppNotification(notificationElement);
    });

    // Auto dismiss después de 4 segundos
    setTimeout(() => {
      this.dismissWhatsAppNotification(notificationElement);
    }, 4000);

    // Animar entrada
    setTimeout(() => {
      notificationElement.classList.add('show');
    }, 10);
  }

  private dismissWhatsAppNotification(element: HTMLElement) {
    element.classList.remove('show');
    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }, 300);
  }

  private async showFallbackAlert(notification: PushNotificationSchema, imageUrl: string) {
    const toast = await this.toastController.create({
      header: notification.title,
      message: notification.body,
      position: 'top',
      duration: 3000,
      cssClass: 'interactive-toast',
      animated: true,
    });

    // Suscribirse al evento de tap
    toast.addEventListener('click', () => {
      this.handleNotificationTap(notification);
      toast.dismiss();
    });

    await toast.present();
  }
  
}
