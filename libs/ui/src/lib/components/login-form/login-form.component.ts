import { Component, input, OnChanges, output, SimpleChanges } from '@angular/core';
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
import { environment, LoginCredentials } from '@monorepo-bb-app/shared';
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
  
  loginSubmit = output<LoginCredentials>();
  recoverPassword = output<void>();
  usertype = input<ENUM_TYPE_USER>();
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    if(!environment.production) {
      // this.loginForm.get('email')?.setValue('var901106@gmail.com');
      // this.loginForm.get('password')?.setValue('Victor90');
      
    }
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