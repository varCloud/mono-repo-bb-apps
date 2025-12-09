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
import { OnboardingStateService } from '../../../services/onboarding-state.service';

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
    private _onboardingStateService: OnboardingStateService,
  ) {

    effect(() => {
      this._sessionService.user$()
    })
  }

  ngOnInit() {
    this.loadSavedData();
  }

  private loadSavedData() {
    const savedData = this._onboardingStateService.getProfileSetupData();
    if (Object.keys(savedData).length > 0) {
      this.form.patchValue(savedData);
    }
  }

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

    // Guardar datos en el servicio de estado antes de enviar
    const formData = {
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      nickName: this.form.value.nickName,
      phone: this.form.value.phone,
    };
    this._onboardingStateService.setProfileSetupData(formData);

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
        pushNotificationToken: await this._localStorage.get(KEY_LOCALSTORAGE.TOKEN_PUSH) || '',
      };

      this._userService.updateUser(this._sessionService.user$().userId, payload).pipe(
        take(1)
      ).subscribe(response => {
        this._localStorage.set(KEY_LOCALSTORAGE.HAS_NULL_PROFILE_FIELDS, false);
        this._onboardingStateService.clearOnboardingState();
        this.getUserData();

      });
    } catch (error) {
      this._loader.hideLoader();
      this._toast.error(
        this._translate.instant('onboarding.profile-setup.save-error'));
    }
  }

  private async uploadPhoto(image: Photo): Promise<CompleteResultUpload> {
    try {
      let fileName: string;
      let fileData: string;

      if (image.webPath) {
        // Caso web
        const blob = await (await fetch(image.webPath)).blob();
        fileData = await this.blobToBase64(blob);
        fileName = `file_${Date.now()}.${this.getFileExtFromMimeType(image.format)}`;
      } else if (image.base64String) {
        // Caso base64
        fileData = image.base64String;
        fileName = `file_${Date.now()}.${this.getFileExtFromMimeType(image.format)}`;
      } else if (image.path) {
        // Caso móvil - usar el path directamente
        fileData = image.path;
        fileName = image.path.split('/').pop() || `file_${Date.now()}`;
      } else {
        throw new Error('No valid image data found');
      }

      const fileType = guessFileType(fileName);

      const result: CompleteResultUpload = await this._uploadService.uploadFile(
        fileData,
        fileName,
        fileType,
        'public'
      );

      return result;
    } catch (error) {
      console.error('Error in uploadPhoto:', error);
      throw error;
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private getFileExtFromMimeType(format: string = 'jpeg'): string {
    const mimeTypeMap: { [key: string]: string } = {
      'jpeg': 'jpg',
      'jpg': 'jpg',
      'png': 'png',
      'gif': 'gif',
      'webp': 'webp'
    };
    return mimeTypeMap[format.toLowerCase()] || 'jpg';
  }


  public getUserData() {
    this._userService.getUser(this._sessionService.user$().userId).pipe(
      take(1),
      finalize(() => this._loader.hideLoader()),
    ).subscribe((response) => {
      this._toast.success(this._translate.instant('onboarding.profile-setup.save-success'));
      this._router.navigate(['/home']);
    }, (error) => {
      this._loader.hideLoader();
      this._toast.error(this._translate.instant('onboarding.profile-setup.save-error'));
    });
  }

}