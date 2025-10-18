import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonCol,
  IonRow,
  IonInput,
  IonButton,
  IonGrid,
  IonItem,
  IonLabel,
  IonDatetimeButton,
  IonModal,
  IonDatetime,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  AvatarPickerComponent,
  ErrorMessageComponent,
  HeaderComponent,
  InputPhoneComponent,
  LayoutContentComponent,
} from '@monorepo-bb-app/ui';
import {
  CompleteResultUpload,
  CONSTANTS,
  COUNTRY_CODES,
  Countrycode,
  guessFileType,
  ToastService,
} from '@monorepo-bb-app/shared';
import { finalize } from 'rxjs';
import { KEY_LOCALSTORAGE, GENDER_OPTIONS } from '@monorepo-bb-app/shared';
import { Photo } from '@capacitor/camera';
import {
  LoaderUIService,
  LocalStorageService,
  SesionService,
  UploadService,
  UserService,
} from '@monorepo-bb-app/core';

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.scss'],
  imports: [
    IonDatetime,
    IonModal,
    IonDatetimeButton,
    IonLabel,
    IonItem,
    IonGrid,
    IonButton,
    IonRow,
    IonCol,
    IonContent,
    TranslateModule,
    LayoutContentComponent,
    HeaderComponent,
    AvatarPickerComponent,
    TranslateModule,
    IonInput,
    InputPhoneComponent,
    ReactiveFormsModule,
    ErrorMessageComponent,
    CommonModule,
    IonSelect,
    IonSelectOption,
  ],
})
export class CompleteProfileComponent implements OnInit {
  @ViewChild('colorPicker') colorPicker!: ElementRef;
  isLoading = signal(false);
  isoCode = signal<string>('+52');
  form = this._fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    birthdate: ['', Validators.required],
    phone: ['9898989898', Validators.required],
    genderId: [1, Validators.required],
    profileColor: ['', Validators.required],
    nickName: ['', Validators.required],
  });

  genderOpt = GENDER_OPTIONS;
  imageProfile: Photo | null = null;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _localStorage: LocalStorageService,
    private _userService: UserService,
    private _toast: ToastService,
    private _translate: TranslateService,
    private _uploadService: UploadService,
    private _sesionService: SesionService,
    private _loader: LoaderUIService
  ) {
    effect(() => {
      const user = this._sesionService.user$();
      this.form.patchValue({
        profileColor: user?.profileColor || '#000',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.phone || null,
        nickName: user?.nickName || '',
        birthdate: user?.birthdate || this.getMaxDate(),
        genderId: user?.genderId || 1,
      });
      this.isoCode.set(user?.isoCode || COUNTRY_CODES[0].dialCode);
    });
  }

  ngOnInit() {}

  getMaxDate(): string {
    const today = new Date();
    const maxDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    return maxDate.toISOString();
  }

  async onImageSelected(image: any) {
    this.imageProfile = image;
  }

  openColorPicker() {
    this.colorPicker.nativeElement.click();
  }

  async onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this._loader.showLoader();

    const userId = this._sesionService.user$()?.userId || 0;
    let imageUrl = '';
    try {
      if (this.imageProfile) {
        const img = await this.uploadPhoto(this.imageProfile);
        imageUrl = img?.location || '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }

    const payload = {
      firstName: this.form.value.firstName || '',
      lastName: this.form.value.lastName || '',
      profileColor:
        this.form.value.profileColor || CONSTANTS.USER_DEFAULT_COLOR,
      nickName: this.form.value.nickName || '',
      birthdate: this.form.value.birthdate || '',
      phone: this.form.value.phone ?? '',
      isoCode: this.isoCode(),
      genderId: this.form.value.genderId || 3,
      profilePictureUrl: imageUrl,
    };
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
          this._router.navigate(['/stripe-onbording']);
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

  onMaskSelected(mask: Countrycode) {
    this.isoCode.set(mask.dialCode);
  }
  private async uploadPhoto(image: Photo): Promise<CompleteResultUpload> {
    const fileName = image.path!.split('/').pop() || `file_${Date.now()}`;
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
