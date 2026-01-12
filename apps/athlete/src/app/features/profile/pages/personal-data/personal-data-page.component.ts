import { Component, effect, OnInit, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonBackButton,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonRow,
} from '@ionic/angular/standalone';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  AthletePhysicalInfoFormComponent,
  AthleteProfileBasicFormComponent,
  LayoutContentComponent,
  RadioListSelectorComponent,
  SelectOption,
  ErrorMessageComponent,
} from '@monorepo-bb-app/ui';

import { LoaderUIService, SesionService, UploadService, UserService } from '@monorepo-bb-app/core';
import {
  CompleteResultUpload,
  Countrycode,
  guessFileType,
  proceessUploadPhoto,
  ToastService,
  CatalogsService,
  CatalogType,
} from '@monorepo-bb-app/shared';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { endWith, finalize, take } from 'rxjs';
import { Photo } from '@capacitor/camera';
import { BUCKET_TYPE } from 'libs/shared/constants/enums';
import { Storage } from '@ionic/storage-angular';
import { OnboardingStateService } from '../../../user/services/onboarding-state.service';

@Component({
  selector: 'app-personal-data-page',
  templateUrl: './personal-data-page.component.html',
  styleUrls: ['./personal-data-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonBackButton,
    ReactiveFormsModule,
    TranslateModule,
    LayoutContentComponent,
    AthleteProfileBasicFormComponent,
    AthletePhysicalInfoFormComponent,
    RadioListSelectorComponent,
    ErrorMessageComponent,
  ],
})
export class PersonalDataPageComponent implements OnInit {
  basicForm!: FormGroup;
  physicalForm!: FormGroup;
  levelForm!: FormGroup;
  activityLevelOptions = signal<SelectOption[]>([]);
  imageProfile: Photo | null = null;
  isoCode = signal<string>('+52');
  levelId = signal<string>('');
  constructor(
    private fb: FormBuilder,
    private _translateService: TranslateService,
    private _toastService: ToastService,
    private _loaderService: LoaderUIService,
    private sesionService: SesionService,
    private _userService: UserService,
    private _uploadService: UploadService,
    private _catalogsService: CatalogsService,
    private _storage: Storage,
    private _onboardingStateService: OnboardingStateService
  ) {
    effect(() => {
      const user = this.sesionService.user$();
    });
  }

  async initStorageLevel() {
    await this._storage.create();
    const value = await this._storage.get('user');
    return value.levelId;
  }

  ngOnInit() {
    this.levelId.set(String(this.initStorageLevel()));
    this.initializeForms();
    this.loadUserData();
    this.getActivityLevel();
  }

  onActivityLevelChange(selectedLevel: any): void {
    this.levelForm.patchValue({ activityLevel: selectedLevel });
  }

  private getActivityLevel() {
    this._loaderService.showLoader();
    this._catalogsService.getCatalog(CatalogType.DIFFICULTY_LEVELS).subscribe({
      next: (levels: any) => {
        this._loaderService.hideLoader();
        this.activityLevelOptions.set(
          levels.map((level) => ({
            label: level.description,
            value: level.levelId,
          }))
        );
      },
      error: (error) => {
        console.error('Error loading activity levels', error);
        this._loaderService.hideLoader();
        this._toastService.error(
          this._translateService.instant('onboarding.select-level.load-error'),
          { duration: 1000 }
        );
      },
    });
  }

  private loadUserData() {
    const currentUser = this.sesionService.user$();

    if (currentUser) {
      this.basicForm.patchValue({
        profilePictureUrl: currentUser.profilePictureUrl || '',
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        nickName: currentUser.nickName || '',
        phone: currentUser.phone || '',
      });
      this.physicalForm.patchValue({
        genderId: currentUser.genderId || '',
        birthdate: new Date(currentUser.birthdate).toISOString() || '',
        age: currentUser.age || '',
        weight: currentUser.weight || '',
        height: currentUser.height || '',
      });

      this.levelForm.patchValue({
        activityLevel: String(currentUser.levelId) || '',
      });
    }
  }

  private initializeForms() {
    this.basicForm = this.fb.group({
      profilePictureUrl: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nickName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
    });

    this.physicalForm = this.fb.group({
      genderId: ['', [Validators.required]],
      birthdate: ['', [Validators.required]],
      age: [{ value: '', disabled: true }],
      weight: ['', [Validators.required, Validators.min(0)]],
      height: ['', [Validators.required, Validators.min(0)]],
    });

    this.levelForm = this.fb.group({
      activityLevel: ['', Validators.required],
    });
  }

  async onBasicFormSubmit(formValue: any) {
    if (this.basicForm.valid) {
    }
  }

  async onPhysicalFormSubmit(formValue: any) {
    if (this.physicalForm.valid) {
    }
  }
  async onLevelFormSubmit(formValue: any) {
    if (this.levelForm.valid) {
    }
  }

  async onImageSelected(event: any) {
    this.imageProfile = event;
  }

  async onMaskSelected(mask: Countrycode) {
    this.isoCode.set(mask.dialCode);
  }

  async saveAllChanges() {
    this._loaderService.showLoader();
    if (this.isFormsValid) {
      try {
        if (this.validateImageProfile()) {
          const uploadResult = await this.uploadPhoto(this.imageProfile!);
          this.basicForm.patchValue({ profilePictureUrl: uploadResult.location });
        }

        const combinedData = {
          ...this.basicForm.value,
          ...this.physicalForm.value,

          height: this.physicalForm.value.height.toString(),
          weight: this.physicalForm.value.weight.toString(),
        };

        const currentUser = this.sesionService.user$();
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            ...combinedData,
          };

          this.sesionService.setUser(updatedUser);
          const lvl = {
            activityLevel: this.levelForm.value,
          };
          this._onboardingStateService.setSelectLevelData(lvl);

          this._userService
            .updateUser(currentUser.userId, combinedData)
            .pipe(
              take(1),
              finalize(() => this._loaderService.hideLoader())
            )
            .subscribe(() => {
              this.showSuccessMessage('profile.save.success');
              this.loadUserData();
            });
        }
      } catch (error) {
        this._loaderService.hideLoader();
        console.log('Error saving profile data:', error);
        await this.showErrorMessage('profile.save.error');
      }
    } else {
      this._loaderService.hideLoader();
      await this.showErrorMessage('profile.validation.error');
    }
  }

  async showSuccessMessage(key: string) {
    const message = await this._translateService.get(key).toPromise();
    await this._toastService.success(message);
  }

  async showErrorMessage(key: string) {
    const message = await this._translateService.get(key).toPromise();
    await this._toastService.error(message);
  }

  get isFormsValid(): boolean {
    return this.basicForm.valid && this.physicalForm.valid && this.levelForm.valid;
  }

  private validateImageProfile(): boolean {
    return this.imageProfile !== null;
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
