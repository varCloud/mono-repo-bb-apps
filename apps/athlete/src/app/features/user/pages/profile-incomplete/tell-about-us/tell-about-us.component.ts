import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
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
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  ErrorMessageComponent,
  HeaderComponent,
  LayoutContentComponent,
  RadioCardSelectorComponent,
  SelectOption
} from '@monorepo-bb-app/ui';
import { ToastService, User } from '@monorepo-bb-app/shared';
import { LoaderUIService, SesionService, UserService } from '@monorepo-bb-app/core';
import { OnboardingService } from '../../../services/onboarding.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-tell-about-us',
  templateUrl: './tell-about-us.component.html',
  styleUrls: ['./tell-about-us.component.scss'],
  standalone: true,
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
    RadioCardSelectorComponent,
    IonInput,
    ReactiveFormsModule,
    ErrorMessageComponent,
    CommonModule,
  ],
})
export class TellAboutUsComponent implements OnInit {



  public form = this._fb.group({
    gender: ['', Validators.required],
    birthdate: ['', Validators.required],
    age: [{ value: '', disabled: true }, [Validators.required, Validators.min(13), Validators.max(100)]],
    weight: ['', [Validators.required]],
    height: ['', [Validators.required]],
  });
  public genderOptions = signal<SelectOption[]>([]);
  public userSesion: User
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _toast: ToastService,
    private _translate: TranslateService,
    private _loader: LoaderUIService,
    private _userService: UserService,
    private _sesionService: SesionService) {
    effect(() => {
      this.userSesion = this._sesionService.user$()!;
      console.log(this.genderOptions());
    });
  }

  ngOnInit() {
    this.form.patchValue({
      birthdate: this.getMaxDate()
    });
    this.onBirthdateChange();
    this.loadGenderOptions();
  }

  private loadGenderOptions() {
    this._translate.get(['genders.male', 'genders.female', 'genders.other']).subscribe(translations => {
      this.genderOptions.set([
        { value: 1, label: translations['genders.male'], image: 'assets/icons/onboarding/male.svg' },
        { value: 2, label: translations['genders.female'], image: 'assets/icons/onboarding/female.svg' },
        { value: 3, label: translations['genders.other'], image: 'assets/icons/onboarding/none.svg' }
      ]);
    });
  }

  getMaxDate(): string {
    const today = new Date();
    const maxDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate(),
    );
    return maxDate.toISOString();
  }

  onGenderChange(selectedGender: any): void {
    this.form.patchValue({ gender: selectedGender });
  }

  onBirthdateChange(): void {
    const birthdate = this.form.get('birthdate')?.value;
    if (birthdate) {
      const age = this.calculateAge(new Date(birthdate));
      this.form.patchValue({ age: age.toString() });
    }
  }

  private calculateAge(birthdate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }

    return age;
  }

  async onContinue() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this._loader.showLoader();
    try {
      const payload = {
        gender: this.form.value.gender,
        birthdate: this.form.value.birthdate,
        age: this.form.get('age')?.value.toString(),
        weight: this.form.value.weight.toString(),
        height: this.form.value.height.toString(),
      }
      this._userService.updateUser(this.userSesion.userId!, payload).pipe(take(1)).subscribe((reponse: any) => {
        this._loader.hideLoader();
        this._toast.success(this._translate.instant('informacion guardada con éxito'));
        this._router.navigate(['/profile-incomplete/select-goals']);
      });
    } catch (error) {
      console.error(error);
      this._toast.error(
        this._translate.instant('espere un momento e intente de nuevo'),
        { duration: 1000 }
      );
    }
  }
}