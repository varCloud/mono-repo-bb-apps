import { Component, OnInit } from '@angular/core';
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

import { LoaderUIService, SesionService } from '@monorepo-bb-app/core';
import { ToastService } from '@monorepo-bb-app/shared';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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

  constructor(
    private fb: FormBuilder,
    private _translateService: TranslateService,
    private toastService: ToastService,
    private _loaderService: LoaderUIService,
    private sesionService: SesionService
  ) {}

  ngOnInit() {
    this.initializeForms();
    this.loadUserData();
  }

  private loadUserData() {
    const currentUser = this.sesionService.user$();
    if (currentUser) {
      // Cargar datos básicos
      this.basicForm.patchValue({
        avatar: currentUser.profilePictureUrl || '',
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        nickName: currentUser.nickName || '',
        phone: currentUser.phone || '',
      });

      // Cargar datos físicos
      this.physicalForm.patchValue({
        gender: currentUser.gender || '',
        birthdate: currentUser.birthdate || '',
        age: currentUser.age || '',
        weight: currentUser.weight || '',
        height: currentUser.height || '',
      });
    }
  }

  private initializeForms() {
    // Initialize basic form
    this.basicForm = this.fb.group({
      avatar: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nickName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
    });

    // Initialize physical form
    this.physicalForm = this.fb.group({
      gender: ['', [Validators.required]],
      birthdate: ['', [Validators.required]],
      age: [{ value: '', disabled: true }],
      weight: ['', [Validators.required, Validators.min(30), Validators.max(200)]],
      height: ['', [Validators.required, Validators.min(100), Validators.max(250)]],
    });
  }

  async onBasicFormSubmit(formValue: any) {
    if (this.basicForm.valid) {
      await this.saveChanges('basic', formValue);
    }
  }

  async onPhysicalFormSubmit(formValue: any) {
    if (this.physicalForm.valid) {
      await this.saveChanges('physical', formValue);
    }
  }

  async saveAllChanges() {
    if (this.isFormsValid()) {
      try {
        await this._loaderService.showLoader();
        const combinedData = {
          ...this.basicForm.value,
          ...this.physicalForm.value,
        };

        // Actualizar datos en el servicio de sesión
        const currentUser = this.sesionService.user$();
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            ...combinedData
          };
          
          // Aquí iría la llamada al servicio para actualizar en el backend
          // await this.userService.updateProfile(updatedUser);
          //this.sesionService.updateUser(updatedUser);
          await this.showSuccessMessage('profile.save.success');
        }
      } catch (error) {
        await this.showErrorMessage('profile.save.error');
      } finally {
        await this._loaderService.hideLoader();
      }
    } else {
      await this.showErrorMessage('profile.validation.error');
    }
  }

  private async saveChanges(type: 'basic' | 'physical', formValue: any) {
    try {
      await this._loaderService.showLoader();
      const currentUser = this.sesionService.user$();
      
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          ...formValue
        };
        
        //this.sesionService.updateUser(updatedUser);
        await this.showSuccessMessage('profile.save.success');
      }
    } catch (error) {
      await this.showErrorMessage('profile.save.error');
    } finally {
      await this._loaderService.hideLoader();
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
}