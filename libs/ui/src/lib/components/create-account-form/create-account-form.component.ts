import { Component, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import {
  IonButton,
  IonInput,
  IonRow,
  IonCol,
  IonGrid,
  IonInputPasswordToggle,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { ENUM_TYPE_USER } from 'libs/shared/constants/enums';
import { UserCreateAccountPayload } from '@monorepo-bb-app/shared';
import { TermsAndConditions } from '../terms-and-conditions/terms-and-conditions';

@Component({
  selector: 'app-create-account-form',
  templateUrl: './create-account-form.component.html',
  styleUrls: ['./create-account-form.component.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonCol,
    IonRow,
    IonInput,
    IonButton,
    IonInputPasswordToggle,
    ReactiveFormsModule,
    TranslateModule,
    TermsAndConditions,
  ],
})
export class CreateAccountFormComponent {
  // Inputs siguiendo estándares de la app
  userType = input<ENUM_TYPE_USER>();

  // Outputs siguiendo estándares de la app
  createAccountSubmit = output<UserCreateAccountPayload>();

  createAccountForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.createAccountForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      passwordHash: ['', [Validators.required, Validators.minLength(6)]],
      terms: [false, [Validators.requiredTrue]],
    });
  }

  onSubmit() {
    if (this.createAccountForm.valid) {
      const payload: UserCreateAccountPayload = {
        email: this.createAccountForm.value.email,
        passwordHash: this.createAccountForm.value.passwordHash,
        userTypeId: this.userType(),
      };
      this.createAccountSubmit.emit(payload);
    } else {
      this.createAccountForm.markAllAsTouched();
    }
  }
}
