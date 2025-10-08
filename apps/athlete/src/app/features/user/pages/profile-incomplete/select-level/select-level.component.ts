import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonCol,
  IonRow,
  IonButton,
  IonGrid,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { 
  ErrorMessageComponent, 
  HeaderComponent, 
  LayoutContentComponent,
  RadioListSelectorComponent,
  SelectOption 
} from '@monorepo-bb-app/ui';
import { ToastService } from '@monorepo-bb-app/shared';
import { LoaderUIService } from '@monorepo-bb-app/core';

@Component({
  selector: 'app-select-level',
  templateUrl: './select-level.component.html',
  styleUrls: ['./select-level.component.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonButton,
    IonRow,
    IonCol,
    IonContent,
    TranslateModule,
    LayoutContentComponent,
    HeaderComponent,
    RadioListSelectorComponent,
    ReactiveFormsModule,
    ErrorMessageComponent,
    CommonModule,
  ],
})
export class SelectLevelComponent implements OnInit {
  
  isLoading = signal(false);
  
  form = this._fb.group({
    activityLevel: ['', Validators.required],
  });

  // Opciones de nivel de actividad usando nuestro componente genérico
  activityLevelOptions = signal<SelectOption[]>([
    {
      value: 'beginner',
      label: 'onboarding.activity-level.beginner',
      description: 'onboarding.activity-level.beginner-desc'
    },
    {
      value: 'intermediate',
      label: 'onboarding.activity-level.intermediate',
      description: 'onboarding.activity-level.intermediate-desc'
    },
    {
      value: 'advanced',
      label: 'onboarding.activity-level.advanced',
      description: 'onboarding.activity-level.advanced-desc'
    }
  ]);

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _toast: ToastService,
    private _translate: TranslateService,
    private _loader: LoaderUIService,
  ) {}

  ngOnInit() {}

  onActivityLevelChange(selectedLevel: any): void {
    this.form.patchValue({ activityLevel: selectedLevel });
  }

  async onContinue() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    try {
      // Aquí puedes guardar los datos en un servicio temporal
      // await this.onboardingService.saveActivityLevel(this.form.value);
      
      this._toast.success(
        this._translate.instant('onboarding.select-level.save-success'),
        { duration: 1000 }
      );
      
      // Navegar a la siguiente pantalla
      this._router.navigate(['/profile-incomplete/profile-setup']);
      
    } catch (error) {
      this._toast.error(
        this._translate.instant('onboarding.select-level.save-error'),
        { duration: 1000 }
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}