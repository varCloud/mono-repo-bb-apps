import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
import { ToastColor, ToastConfig, ToastOptions, ToastPosition } from '../models/toast.model';
import { addIcons } from 'ionicons';
import { closeCircleOutline } from 'ionicons/icons';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {
    addIcons({ closeCircleOutline });
  }

  private async createToast({
    position = ToastPosition.Bottom,
    message = '',
    cssClass = '',
    color = ToastColor.Success,
    duration = 0,
  }: ToastOptions) {
    const toast = await this.toastController.create({
      message,
      position: position,
      color: color,
      cssClass: cssClass,
      duration: duration > 0 ? duration : undefined,
      buttons: [
        {
          icon: closeCircleOutline,
          role: 'cancel',
        },
      ],
    });

    await toast.present();
  }

  public success(message: string, toastConf: ToastConfig = {}) {
    return this.createToast({
      ...toastConf,
      message,
      cssClass: (toastConf.cssClass || '') + ' bb-toast-success',
      color: ToastColor.Success,
      duration: toastConf.duration,
    });
  }

  public error(message: string, toastConf: ToastConfig = {}) {
    return this.createToast({
      ...toastConf,
      message,
      cssClass: (toastConf.cssClass || '') + ' bb-toast-error',
      color: ToastColor.Danger,
      duration: toastConf.duration,
    });
  }

  public info(message: string, toastConf: ToastConfig = {}) {
    return this.createToast({
      ...toastConf,
      message,
      cssClass: (toastConf.cssClass || '') + ' bb-toast-info',
      color: ToastColor.Primary,
      duration: toastConf.duration,
    });
  }

  public warning(message: string, toastConf: ToastConfig = {}) {
    return this.createToast({
      ...toastConf,
      message,
      cssClass: (toastConf.cssClass || '') + ' bb-toast-warning',
      color: ToastColor.Warning,
      duration: toastConf.duration,
    });
  }
}