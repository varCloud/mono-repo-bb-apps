import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import {
  ActionSheetController,
  LoadingController,
  IonicModule,
} from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem } from '@capacitor/filesystem';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { UploadService } from '@monorepo-bb-app/core';
import { CompleteResultUpload } from '@monorepo-bb-app/shared';
import { FileAccessPermissionService } from '@monorepo-bb-app/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BlockUIModule } from 'ng-block-ui';
import { LayoutContentComponent } from '@monorepo-bb-app/ui';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonButton,
  IonText,
  IonImg,
  IonList,
  IonHeader,
  IonToolbar,
  IonItem,
  IonProgressBar,
  IonTitle,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
// import eliminado, ya importado desde @monorepo-bb-app/shared

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  imports: [
    IonImg,
    IonText,
    IonButton,
    IonInput,
    IonCol,
    IonRow,
    IonGrid,
    IonHeader,
    IonItem,
    IonToolbar,
    IonList,
    IonContent,
    TranslateModule,
    LayoutContentComponent,
    IonProgressBar,
    BlockUIModule,
    ReactiveFormsModule,
    IonButton,
    IonTitle,
    IonIcon,
    IonLabel,
    CommonModule,
  ],
})
export class FileUploadComponent implements OnInit {
  uploadProgress = 0;
  isUploading = false;

  constructor(
    private uploadService: UploadService,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private fileAccessPermission: FileAccessPermissionService,
    private platform: Platform,
  ) {}

  ngOnInit(): void {}

  async selectFile() {
    const hasPermission =
      await this.fileAccessPermission.hasPermission('camera');
    if (!hasPermission) {
      await this.fileAccessPermission.checkCameraPermission();
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Seleccionar archivo',
      buttons: [
        {
          text: 'Galería de imágenes',
          handler: () => this.pickFile(CameraSource.Photos),
        },
        {
          text: 'Videos',
          handler: async () => {
            await this.openNativeFileInput();
          },
        },
        {
          text: 'Pdfs',
          handler: async () => {
            await this.openNativeFileInput();
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  private async pickFile(source: CameraSource) {
    try {
      const file = await Camera.getPhoto({
        quality: 90,
        source,
        resultType: CameraResultType.Uri,
        allowEditing: false,
        presentationStyle: 'fullscreen',
      });

      if (file?.webPath) {
        await this.uploadFile(file.webPath);
      }
    } catch (error) {
      console.log('Usuario canceló la selección o no otorgó permisos', error);
    }
  }

  private async uploadFile(fileUri: string) {
    try {
      this.isUploading = true;
      const fileName = fileUri.split('/').pop() || `file_${Date.now()}`;
      const fileType = this.guessFileType(fileName);
      const result: CompleteResultUpload = await this.uploadService.uploadFile(
        fileUri,
        fileName,
        fileType,
      );
      console.log('Resultado de la subida:', result);
    } catch (error) {
      console.error('Error subiendo archivo:', error);
    } finally {
      this.isUploading = false;
    }
  }

  async openNativeFileInput() {
    if (this.platform.is('android') || this.platform.is('ios')) {
      try {
        const permission = await FilePicker.checkPermissions();
        console.log('Permisos de archivo:', JSON.stringify(permission));
        const result = await FilePicker.pickFiles();
        const file = result.files[0];
        try {
          await Filesystem.stat({ path: file.path! });
          await this.uploadService.uploadFile(
            file.path!,
            file.name,
            file.mimeType,
          );
        } catch (fsError) {
          console.error('No se puede leer el archivo seleccionado:', fsError);
        }
      } catch (error) {
        console.log('Usuario canceló o error:', error);
      }
    }
  }

  private guessFileType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase() || '';

    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return `image/${extension}`;
    } else if (['mp4', 'mov', 'avi'].includes(extension)) {
      return `video/${extension}`;
    } else if (extension === 'pdf') {
      return 'application/pdf';
    }

    return 'application/octet-stream';
  }
}
