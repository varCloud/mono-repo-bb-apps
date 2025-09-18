import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonBackButton,
  IonInput,
  IonRow,
  IonCol,
  IonGrid,
  IonContent,
  IonInputPasswordToggle,
  IonText,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderComponent, LayoutContentComponent } from '@monorepo-bb-app/ui';

import { LoginService } from '../../services/login.service';
import { LoginCredentials, UserResponse, ToastService } from '@monorepo-bb-app/shared';
import { BlockUIModule } from 'ng-block-ui';
import { Router, RouterLink } from '@angular/router';
import { LoaderUIService } from '@monorepo-bb-app/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonCol,
    IonRow,
    IonInput,
    IonButton,
    IonContent,
    LayoutContentComponent,
    HeaderComponent,
    TranslateModule,
    IonInputPasswordToggle,
    ReactiveFormsModule,
    IonText,
    BlockUIModule,
    RouterLink,
    TranslateModule
  ],
})
export class LoginComponent implements OnInit {
  loginForm: ReturnType<FormBuilder['group']>;
  
  constructor(
    private _formBuilder: FormBuilder,
    private _loginService: LoginService,
    private _toastService: ToastService,
    private _translate: TranslateService,
    private _router: Router,
    private _loader: LoaderUIService,
  ) {
    this.loginForm = this._formBuilder.group({
      email: ['sapitopicador@gmail.com', [Validators.required, Validators.email]],
      password: ['Victor90', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {}

  public async onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const user = this.loginForm.value as LoginCredentials;
    this._loader.showLoader();

    this._loginService.login(user).subscribe({
      next: (user: UserResponse) => {
        this._loader.hideLoader();
        this._router.navigate(['/home']);
      },
      error: () => {
        this._loader.hideLoader();
        this._toastService.error(
          this._translate.instant('login.errors.invalid-credentials'),
          { duration: 3000 }
        );
      },
    });
  }

  public onRecoverPassword() {
    this._router.navigate(['/forgot-password']);
  }
}