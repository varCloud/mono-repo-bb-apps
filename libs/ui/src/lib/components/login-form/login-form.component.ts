import { Component, input, output } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import {
  IonButton,
  IonInput,
  IonRow,
  IonCol,
  IonGrid,
  IonInputPasswordToggle,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { LoginCredentials } from '@monorepo-bb-app/shared';
import { ENUM_TYPE_USER } from 'libs/shared/constants/enums';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
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
  ],
})
export class LoginFormComponent {
  // Outputs siguiendo estándares de la app
  loginSubmit = output<LoginCredentials>();
  recoverPassword = output<void>();
  usertype = input<ENUM_TYPE_USER>();
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials: LoginCredentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
        userType: this.usertype()
      };
      this.loginSubmit.emit(credentials);
    }
  }

  onRecoverPassword() {
    this.recoverPassword.emit();
  }
}