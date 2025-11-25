import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormPersonalDataCreatorComponent } from '@monorepo-bb-app/ui';
import {
  PersonalData,
  CompleteResultUpload,
  guessFileType,
  CONSTANTS,
  KEY_LOCALSTORAGE,
  ToastService,
  GENDER_OPTIONS,
  User,
} from '@monorepo-bb-app/shared';
import {
  IonItem,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonRow,
  IonCol,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonContent,
  IonItemGroup,
  IonGrid,
} from '@ionic/angular/standalone';
import { LayoutContentComponent } from '@monorepo-bb-app/ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  LoaderUIService,
  SesionService,
  UploadService,
  LocalStorageService,
  UserService,
} from '@monorepo-bb-app/core';
import { Photo } from '@capacitor/camera';
import { AvatarPickerComponent } from '@monorepo-bb-app/ui';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personal-data',
  standalone: true,
  imports: [
    IonRow,
    IonCol,
    AvatarPickerComponent,
    TranslateModule,
    LayoutContentComponent,
    CommonModule,
    IonItem,
    IonHeader,
    IonContent,
    IonTitle,
    IonToolbar,
    IonSelect,
    IonSelectOption,
    IonInput,
    FormPersonalDataCreatorComponent,
    TranslateModule,
    IonItemGroup,
    IonGrid
  ],
  templateUrl: './personal-data.page.html',
  styleUrls: ['./personal-data.page.scss'],
})
export class PersonalDataPage implements OnInit {
  dataPhoto: Photo | null = null;
  user = this._sesionService.user$();
  currentUserData: any | null = null;
  genderOpt = GENDER_OPTIONS;

  constructor(
    private _sesionService: SesionService,
    private _uploadService: UploadService,
    private _localStorage: LocalStorageService,
    private _userService: UserService,
    private _translate: TranslateService,
    private _toast: ToastService,
    private _loader: LoaderUIService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.currentUserData = {
      firstName: this.user?.firstName || '',
      lastName: this.user?.lastName || '',
      nickname: this.user?.nickName || '',
      birthDate: this.user?.birthdate || '',
      gender: this.user?.genderId || '',
      countryCodePrefix: '+52',
      phoneNumber: this.user?.phone || '',
      profileColor: this.user?.profileColor || '#000000',
    };
  }

  takeDataPhoto(image: Photo) {
    this.dataPhoto = image;
  }

  async handleSaveProfile(updatedData: PersonalData) {

    const userId = this._sesionService.user$()?.userId || 0;
    let imageUrl = '';
    try {
      if (this.dataPhoto) {
        const img = await this.uploadPhoto(this.dataPhoto);
        imageUrl = img?.location || '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }

    const payload = {
      firstName: updatedData.firstName || '',
      lastName: updatedData.lastName || '',
      profileColor: updatedData.profileColor || CONSTANTS.USER_DEFAULT_COLOR,
      nickName: updatedData.nickname || '',
      birthdate: updatedData.birthDate || '',
      phone: updatedData.phoneNumber ?? '',
      isoCode: updatedData.countryCodePrefix,
      genderId: Number(updatedData.gender), //agregar dato dinamico
      profilePictureUrl: imageUrl,
      pushNotificationToken:
        (await this._localStorage.get(KEY_LOCALSTORAGE.TOKEN_PUSH)) || '',
    };
    console.log('payload', payload, 'userid', userId, 'updateddata', updatedData);
    this._userService
      .updateUser(userId, payload)
      .pipe(finalize(() => this._loader.hideLoader()))
      .subscribe({
        next: () => {
          this._toast.success(
            this._translate.instant('create-account-profile.save-success'),
            { duration: 500 }
          );
          this._localStorage.set(
            KEY_LOCALSTORAGE.HAS_NULL_PROFILE_FIELDS,
            false
          );
        },
        error: (err) => {
          this._toast.error(
            this._translate.instant('create-account-profile.save-error'),
            {
              duration: 1000,
            }
          );
        },
      });
  }

  private async uploadPhoto(image: Photo): Promise<CompleteResultUpload> {
    const fileName = image.path || `file_${Date.now()}`;
    const fileType = guessFileType(fileName);
    const result: CompleteResultUpload = await this._uploadService.uploadFile(
      image.path!,
      fileName,
      fileType,
      'public'
    );
    return result;
  }
}
