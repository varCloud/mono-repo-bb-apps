import { Component, effect, OnInit, signal } from '@angular/core';
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
import { AthletePhysicalInfoFormComponent, AthleteProfileBasicFormComponent, LayoutContentComponent } from '@monorepo-bb-app/ui';

import { LoaderUIService, SesionService, UploadService, UserService } from '@monorepo-bb-app/core';
import { CompleteResultUpload, Countrycode, guessFileType, proceessUploadPhoto, ToastService } from '@monorepo-bb-app/shared';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { endWith, finalize, take } from 'rxjs';
import { Photo } from '@capacitor/camera';
import { BUCKET_TYPE } from 'libs/shared/constants/enums';

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
  ],
})
export class PersonalDataPageComponent implements OnInit {
  basicForm!: FormGroup;
  physicalForm!: FormGroup;
  imageProfile: Photo | null = null;
  isoCode = signal<string>('+52');
  constructor(
    private fb: FormBuilder,
    private _translateService: TranslateService,
    private toastService: ToastService,
    private _loaderService: LoaderUIService,
    private sesionService: SesionService,
    private _userService: UserService,
    private _uploadService: UploadService,

  ) {
    effect(() => {
       const user = this.sesionService.user$();
       console.log(`efecto en personal data page: ${user.firstName}`);
    });
  }

  ngOnInit() {
    this.initializeForms();
    this.loadUserData();
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
      weight: ['', [Validators.required, Validators.min(30), Validators.max(200)]],
      height: ['', [Validators.required, Validators.min(100), Validators.max(250)]],
    });
  }

  async onBasicFormSubmit(formValue: any) {
    if (this.basicForm.valid) {
      console.log('Basic Form Value:', formValue);
    }
  }

  async onPhysicalFormSubmit(formValue: any) {
    if (this.physicalForm.valid) {
      console.log('Physical Form Value:', formValue);
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
    if (this.isFormsValid()) {
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
          
          this.sesionService.setUser(updatedUser)
          this._userService.updateUser(currentUser.userId, combinedData)
            .pipe(take(1),
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
    await this.toastService.success(message);
  }

  async showErrorMessage(key: string) {
    const message = await this._translateService.get(key).toPromise();
    await this.toastService.error(message);
  }

  isFormsValid(): boolean {
    return this.basicForm.valid && this.physicalForm.valid;
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