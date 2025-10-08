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
  CheckboxListSelectorComponent,
  SelectOption 
} from '@monorepo-bb-app/ui';
import { ToastService } from '@monorepo-bb-app/shared';
import { LoaderUIService } from '@monorepo-bb-app/core';

@Component({
  selector: 'app-select-goals',
  templateUrl: './select-goals.component.html',
  styleUrls: ['./select-goals.component.scss'],
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
    CheckboxListSelectorComponent,
    ReactiveFormsModule,
    ErrorMessageComponent,
    CommonModule,
  ],
})
export class SelectGoalsComponent implements OnInit {
  
  isLoading = signal(false);
  
  form = this._fb.group({
    goals: this._fb.control<any[]>([], [Validators.required, Validators.minLength(1)]),
  });

  // Opciones de objetivos usando nuestro componente genérico
  goalsOptions = signal<SelectOption[]>([
    {
      value: 'weight_loss',
      label: 'onboarding.goals.weight-loss',
      description: 'onboarding.goals.weight-loss-desc',
      icon: 'trending-down'
    },
    {
      value: 'muscle_gain',
      label: 'onboarding.goals.muscle-gain',
      description: 'onboarding.goals.muscle-gain-desc',
      icon: 'fitness'
    },
    {
      value: 'endurance',
      label: 'onboarding.goals.endurance',
      description: 'onboarding.goals.endurance-desc',
      icon: 'bicycle'
    },
    {
      value: 'strength',
      label: 'onboarding.goals.strength',
      description: 'onboarding.goals.strength-desc',
      icon: 'barbell'
    },
    {
      value: 'flexibility',
      label: 'onboarding.goals.flexibility',
      description: 'onboarding.goals.flexibility-desc',
      icon: 'body'
    },
    {
      value: 'general_fitness',
      label: 'onboarding.goals.general-fitness',
      description: 'onboarding.goals.general-fitness-desc',
      icon: 'heart'
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

  onGoalsChange(selectedGoals: any[]): void {
    this.form.patchValue({ goals: selectedGoals });
  }

  async onContinue() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    try {
      // Aquí puedes guardar los datos en un servicio temporal
      // await this.onboardingService.saveGoals(this.form.value);
      
      this._toast.success(
        this._translate.instant('onboarding.select-goals.save-success'),
        { duration: 1000 }
      );
      
      // Navegar a la siguiente pantalla
      this._router.navigate(['/profile-incomplete/select-level']);
      
    } catch (error) {
      this._toast.error(
        this._translate.instant('onboarding.select-goals.save-error'),
        { duration: 1000 }
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}