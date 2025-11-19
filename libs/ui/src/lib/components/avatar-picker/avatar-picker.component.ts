import { Component, Input, Output, EventEmitter, input } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  Platform,
} from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { camera, close, folder, images, pencil } from 'ionicons/icons';
import { ToastService } from '@monorepo-bb-app/shared';
import { IonAvatar, IonIcon, IonText } from '@ionic/angular/standalone';
import { DashedAreaComponent } from '../dashed-area/dashed-area.component';

@Component({
  selector: 'app-avatar-picker',
  templateUrl: './avatar-picker.component.html',
  styleUrls: ['./avatar-picker.component.scss'],
  imports: [IonText, IonIcon, IonAvatar, CommonModule, DashedAreaComponent],
})
export class AvatarPickerComponent {
  @Input() currentImage: string = '';
  @Input() defaultImage: string = '/assets/icon/default-avatar.png';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() disabled: boolean = false;
  @Input() useOnlyDashedElement = false;
  label = input('');
  @Output() imageSelected = new EventEmitter<string>();
  @Output() imageChanged = new EventEmitter<any | null>();

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private platform: Platform,
    private _toastService: ToastService,
  ) {
    addIcons({ pencil, camera, close, folder, images });
  }

  get avatarSize() {
    switch (this.size) {
      case 'small':
        return '60px';
      case 'large':
        return '150px';
      default:
        return '100px';
    }
  }

  get displayImage() {
    return this.currentImage || this.defaultImage;
  }

  async selectImage() {
    if (this.disabled) return;

    const isNative = Capacitor.isNativePlatform();

    const buttons = [
      {
        text: 'Cámara',
        icon: 'camera',
        handler: async () => await this.takePicture(CameraSource.Camera),
      },
    ];

    // Solo agregar la opción de galería si estamos en nativo o web
    if (isNative || this.platform.is('hybrid')) {
      buttons.push({
        text: 'Galería',
        icon: 'images',
        handler: async () => await this.takePicture(CameraSource.Photos),
      });
    }

    if (this.currentImage) {
      buttons.push({
        text: 'Eliminar foto',
        icon: 'trash',
        handler: async () => await this.removeImage(),
      });
    }

    buttons.push({
      text: 'Cancelar',
      icon: 'close',
      handler: async () => {
        // No hacer nada, solo cerrar
      },
    });

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Seleccionar imagen',
      buttons,
    });

    await actionSheet.present();
  }

  private async takePicture(source: CameraSource) {
    try {
      const hasPermissions = await this.checkPermissions();
      if (!hasPermissions) return;

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: source,
        presentationStyle: 'fullscreen',
      });
      if (image.webPath) {
        this.currentImage = image.webPath;
        this.imageSelected.emit(image.webPath);
        this.imageChanged.emit(image);
      }
    } catch (error) {
      await this.showErrorAlert('Error al capturar la imagen');
    }
  }

  private selectFromFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          // 5MB limit
          this.showErrorAlert('La imagen es demasiado grande. Máximo 5MB.');
          return;
        }

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.currentImage = e.target.result;
          this.imageSelected.emit(e.target.result);
          this.imageChanged.emit(file);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  private async removeImage() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que quieres eliminar la imagen de perfil?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.currentImage = '';
            this.imageSelected.emit('');
            this.imageChanged.emit(null);
          },
        },
      ],
    });

    await alert.present();
  }

  private async checkPermissions(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      return true; // En web no necesitamos permisos especiales
    }

    try {
      const permissions = await Camera.checkPermissions();

      if (permissions.camera === 'granted') {
        return true;
      }

      if (permissions.camera === 'denied') {
        await this.showErrorAlert(
          'Se necesitan permisos de cámara para esta función',
        );
        return false;
      }

      // Solicitar permisos
      const requestResult = await Camera.requestPermissions();
      return requestResult.camera === 'granted';
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  }

  private async showErrorAlert(message: string) {
    this._toastService.error(message, { duration: 3000 });
  }

  private dataURLtoFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
}
