import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonGrid, IonRow, IonCol, IonButton, IonContent } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  LayoutContentComponent,
  AvatarPickerComponent,
} from '@monorepo-bb-app/ui';
import {
  LoaderUIService,
  SesionService,
  UploadService
} from '@monorepo-bb-app/core';
import {
  ToastService,
  CompleteResultUpload,
  guessFileType,
  proceessUploadPhoto
} from '@monorepo-bb-app/shared';
import { UserService } from '../../../user/services/user.service';
import { Photo } from '@capacitor/camera';
import { finalize } from 'rxjs';
import { BUCKET_TYPE } from 'libs/shared/constants/enums';

@Component({
  selector: 'app-portada',
  templateUrl: './portada.page.html',
  styleUrls: ['./portada.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    LayoutContentComponent,
    AvatarPickerComponent,
    IonContent
]
})
export class PortadaPage implements OnInit {
  isLoading = signal(false);
  selectedCoverImage: Photo | null = null;
  currentUser: any;

  constructor(
    private router: Router,
    private userService: UserService,
    private sesionService: SesionService,
    private _uploadService: UploadService,
    private loaderService: LoaderUIService,
    private toastService: ToastService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.currentUser = this.sesionService.user$();
    console.log('Current user:', this.currentUser);
  }

  onCoverImageSelected(image: Photo | null) {
    this.selectedCoverImage = image;
  }

  async onSave() {
    if (!this.selectedCoverImage) {
      this.toastService.error(
        this.translateService.instant('portada.no-image-selected')
      );
      return;
    }

    this.isLoading.set(true);
    this.loaderService.showLoader();

    try {
      const userId = this.sesionService.user$()?.userId || 0;
      
      // Subir imagen de portada
      const uploadResult = await this.uploadPhoto(this.selectedCoverImage);
      
      if (!uploadResult?.location) {
        throw new Error('Error al subir la imagen');
      }

      const payload = {
        frontPageUrl: uploadResult.location
      };

      this.userService.updateUser(userId, payload)
        .pipe(finalize(() => {
          this.isLoading.set(false);
          this.loaderService.hideLoader();
        }))
        .subscribe({
          next: (response) => {
            this.toastService.success(
              this.translateService.instant('portada.save-success')
            );

            this.userService.getUser(userId).subscribe();
            this.router.navigate(['home/profile']);
          },
          error: (error) => {
            console.error('Error updating cover image:', error);
            this.toastService.error(
              this.translateService.instant('portada.save-error')
            );
          }
        });

    } catch (error) {
      this.toastService.error(
        this.translateService.instant('portada.save-error')
      );
      this.isLoading.set(false);
      this.loaderService.hideLoader();
    }
  }

  private async uploadPhoto(image: Photo): Promise<CompleteResultUpload> {
    try {
      const dataPhoto = await proceessUploadPhoto(image);
      const result: CompleteResultUpload = await this._uploadService.uploadFile(
        dataPhoto.fileData,
        dataPhoto.fileName,
        dataPhoto.fileType,
        BUCKET_TYPE.PUBLIC
      );

      return result;
    } catch (error) {
      console.error('Error in uploadPhoto:', error);
      throw error;
    }
  }

}