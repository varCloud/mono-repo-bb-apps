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
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  AvatarPickerComponent,
  ErrorMessageComponent,
  HeaderComponent,
  InputPhoneComponent,
  LayoutContentComponent
} from '@monorepo-bb-app/ui';
import {
  CompleteResultUpload,
  CONSTANTS,
  COUNTRY_CODES,
  Countrycode,
  guessFileType,
  KEY_LOCALSTORAGE,
  ToastService
} from '@monorepo-bb-app/shared';
import { finalize, take } from 'rxjs';
import { Photo } from '@capacitor/camera';
import {
  LoaderUIService,
  LocalStorageService,
  SesionService,
  UploadService,
  UserService
} from '@monorepo-bb-app/core';

@Component({
  selector: 'app-profile-setup',
  templateUrl: './profile-setup.component.html',
  styleUrls: ['./profile-setup.component.scss'],
  standalone: true,
  imports: [
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
    IonInput,
    InputPhoneComponent,
    ReactiveFormsModule,
    ErrorMessageComponent,
    CommonModule,
  ],
})
export class ProfileSetupComponent implements OnInit {

  @ViewChild('colorPicker') colorPicker!: ElementRef;

  isLoading = signal(false);
  isoCode = signal<string>('+52');

  form = this._fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: ['', Validators.required],
    nickName: ['', Validators.required],
  });

  imageProfile: Photo | null = null;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _userService: UserService,
    private _toast: ToastService,
    private _translate: TranslateService,
    private _uploadService: UploadService,
    private _loader: LoaderUIService,
    private _sessionService: SesionService,
    private _localStorage: LocalStorageService,
  ) {

    effect(() => {
      this._sessionService.user$()
    })
  }

  ngOnInit() { }

  async onImageSelected(image: any) {
    this.imageProfile = image;
  }

  onMaskSelected(mask: Countrycode) {
    this.isoCode.set(mask.dialCode);
  }

  async onFinishOnboarding() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this._loader.showLoader();

    let imageUrl = '';
    try {
      if (this.imageProfile) {
        const img = await this.uploadPhoto(this.imageProfile);
        imageUrl = img?.location || '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }



    try {
      this._loader.showLoader();
      const payload = {
        firstName: this.form.value.firstName || '',
        lastName: this.form.value.lastName || '',
        nickName: this.form.value.nickName || '',
        phone: this.form.value.phone ?? '',
        isoCode: this.isoCode(),
        profilePictureUrl: imageUrl,
      };

      this._userService.updateUser(this._sessionService.user$().userId, payload).pipe(
        finalize(() => this._loader.hideLoader()),
        take(1)
      ).subscribe(response => {
        this._loader.hideLoader();
        this._localStorage.set(KEY_LOCALSTORAGE.HAS_NULL_PROFILE_FIELDS,false);
        this._toast.success(this._translate.instant('onboarding.profile-setup.save-success'));
        this._router.navigate(['/home']);
      });
    } catch (error) {
      this._loader.hideLoader();
      this._toast.error(
        this._translate.instant('onboarding.profile-setup.save-error'));
    }
  }

  private async uploadPhoto(image: Photo): Promise<CompleteResultUpload> {
    const fileName = image.path!.split('/').pop() || `file_${Date.now()}`;
    const fileType = guessFileType(fileName);
    const result: CompleteResultUpload = await this._uploadService.uploadFile(
      image.path!,
      fileName,
      fileType,
      'public',
    );
    return result;
  }
}