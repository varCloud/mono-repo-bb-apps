import { AboutMeComponent } from '@monorepo-bb-app/ui';
import {
  PersonalData,
  CompleteResultUpload,
  guessFileType,
  CONSTANTS,
  KEY_LOCALSTORAGE,
  ToastService,
  GENDER_OPTIONS,
  User,
  proceessUploadPhoto,
} from '@monorepo-bb-app/shared';
import {
  LoaderUIService,
  SesionService,
  UploadService,
  LocalStorageService,
  UserService,
} from '@monorepo-bb-app/core';
import { Component, OnInit, signal } from '@angular/core';
import { LayoutContentComponent } from '@monorepo-bb-app/ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormPersonalDataCreatorComponent } from '@monorepo-bb-app/ui';
import { Photo } from '@capacitor/camera';
import { BUCKET_TYPE } from 'libs/shared/constants/enums';
import {
  IonFooter,
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
  IonButton,
} from '@ionic/angular/standalone';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-personal-data',
  standalone: true,
  imports: [
    AboutMeComponent,
    IonRow,
    IonCol,
    IonButton,
    IonItem,
    IonHeader,
    IonContent,
    IonTitle,
    IonToolbar,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonItemGroup,
    IonGrid,
    LayoutContentComponent,
    TranslateModule,
    IonFooter,
    FormPersonalDataCreatorComponent,
  ],
  templateUrl: './personal-data.page.html',
  styleUrls: ['./personal-data.page.scss'],
})
export class PersonalDataPage implements OnInit {
  public dataPhoto: Photo | null = null;
  public formAboutMe!: FormGroup;
  public user = this._sesionService.user$();
  public currentUserData!: FormGroup;
  public isDisabled!: 'true';

  constructor(
    private fb: FormBuilder,
    private _sesionService: SesionService,
    private _toastService: ToastService,
    private _loaderService: LoaderUIService,
    private _translateService: TranslateService,
    private _uploadService: UploadService,
    private _userService: UserService,
    private _localStorageService: LocalStorageService,
    private _toast: ToastService
  ) {}

  ngOnInit() {
    this.createForm();
    this.loadFormData();
  }

  private loadFormData() {
    if (this.user) {
      this.formAboutMe.patchValue({
        bio: this.user.bio || '',
      });

      this.currentUserData.patchValue({
        firstName: this.user?.firstName || '',
        lastName: this.user?.lastName || '',
        nickname: this.user?.nickName || '',
        birthdate: this.user?.birthdate || '',
        gender: this.user?.genderId || '',
        countryCodePrefix: CONSTANTS.DEFAULT_COUNTRY_PREFIX,
        phoneNumber: this.user?.phone || '',
        profileColor: this.user?.profileColor || CONSTANTS.USER_DEFAULT_COLOR,
        profilePictureUrl:
          this.user?.profilePictureUrl || CONSTANTS.DEFAULT_AVATAR,
      });
    }
  }

  private createForm() {
    this.formAboutMe = this.fb.group({
      bio: ['', Validators.required],
    });

    this.currentUserData = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      nickname: ['', Validators.required],
      birthdate: [new Date().toISOString(), Validators.required],
      gender: ['', Validators.required],
      countryCodePrefix: [CONSTANTS.DEFAULT_COUNTRY_PREFIX, Validators.required],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      profileColor: [CONSTANTS.USER_DEFAULT_COLOR],
      profilePictureUrl: [''],
    });
  }

  isFormsValid(): boolean {
    return this.formAboutMe.valid && this.currentUserData.valid;
  }

  async onPhysicalFormSubmit(formValue: any) {
    if (this.formAboutMe.valid) {
      console.log('Physical Form Value:', formValue);
    }
  }

  async showSuccessMessage(key: string) {
    const message = await this._translateService.get(key).toPromise();
    await this._toastService.success(message);
  }

  onImageSelected(image: Photo | any) {
    this.dataPhoto = image;
  }

  async handleSaveProfile(formValue: PersonalData) {
    if (this.currentUserData.valid) {
      console.log('Basic Form Value:', formValue);
    }
  }
  async showErrorMessage(key: string) {
    const message = await this._translateService.get(key).toPromise();
    await this._toastService.error(message);
  }

  async saveAllChanges() {

    const userId = this._sesionService.user$()?.userId || 0;
    this._loaderService.showLoader();

    console.log('guardando el formulario');
    if (this.isFormsValid()) {
      let imageUrl = '';
      try {
        if (this.dataPhoto) {
          const img = await this.uploadPhoto(this.dataPhoto);
          imageUrl = img?.location || '';
        } else {
          imageUrl = this.user?.profilePictureUrl || '';
        }

        const payload = {
          firstName: this.currentUserData.get('firstName')?.value || '',
          lastName: this.currentUserData.get('lastName')?.value || '',
          profileColor:
            this.currentUserData.get('profileColor')?.value ||
            CONSTANTS.USER_DEFAULT_COLOR,
          nickName: this.currentUserData.get('nickname')?.value || '',
          birthdate: this.currentUserData.get('birthdate')?.value || '',
          phone: this.currentUserData.get('phoneNumber')?.value ?? '',
          isoCode: this.currentUserData.get('countryCodePrefix')?.value,
          genderId: Number(this.currentUserData.get('gender')?.value),
          profilePictureUrl: imageUrl,
          bio: this.formAboutMe.get('bio')?.value || '',
        };
        if (this.user) {
          const updatedUser = {
            ...this.user,
            ...payload,
          };
          this._sesionService.setUser(updatedUser);
        }

        this._userService
          .updateUser(userId, payload)
          .pipe(finalize(() => this._loaderService.hideLoader()))
          .subscribe({
            next: () => {
              this._toast.success(
                this._translateService.instant(
                  'update-user-data.success'
                ),
                { duration: 500 }
              );
              this._localStorageService.set(
                KEY_LOCALSTORAGE.HAS_NULL_PROFILE_FIELDS,
                false
              );
            },
            error: (err) => {
              this._toast.error(
                this._translateService.instant(
                  'create-account-profile.save-error'
                ),
                {
                  duration: 1000,
                }
              );
            },
          });
      } catch (error) {
        console.error('Error uploading image:', error);
      }
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
