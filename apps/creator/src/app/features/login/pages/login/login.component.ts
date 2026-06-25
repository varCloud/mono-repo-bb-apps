import { Component, OnInit, signal } from '@angular/core';
import {
  IonButton,
  IonRow,
  IonCol,
  IonGrid,
  IonText,
  IonContent,
  IonTitle,
  IonToolbar,
  IonHeader,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  HeaderComponent,
  LayoutContentComponent,
  LoginFormComponent,
} from '@monorepo-bb-app/ui';

import { LoginService } from '../../services/login.service';
import {
  LoginCredentials,
  UserResponse,
  ToastService,
  environment,
} from '@monorepo-bb-app/shared';
import { Router, RouterLink } from '@angular/router';
import { LoaderUIService } from '@monorepo-bb-app/core';
import { ENUM_TYPE_USER } from 'libs/shared/constants/enums';
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonCol,
    IonRow,
    IonButton,
    LayoutContentComponent,
    HeaderComponent,
    TranslateModule,
    IonText,
    RouterLink,
    IonContent,
    LoginFormComponent,
  ],
})
export class LoginComponent implements OnInit {
  constructor(
    private _loginService: LoginService,
    private _toastService: ToastService,
    private _translate: TranslateService,
    private _router: Router,
    private _loader: LoaderUIService
  ) {}
  public userType = ENUM_TYPE_USER.CREATOR;
  public env = { ...environment };
  /** Versión instalada, tomada del build nativo (fallback al environment en web). */
  public appVersion = signal(environment.appVersion);
  async ngOnInit() {
    // Browser.open({ url: 'https://bluecloud.com.mx/2023/bodybooster/fin-onboarding.html' });
    if (Capacitor.isNativePlatform()) {
      const { version } = await App.getInfo();
      this.appVersion.set(version);
    }
  }

  public async onLogin(credentials: LoginCredentials) {
    this._loader.showLoader();

    this._loginService.login(credentials).subscribe({
      next: (user: UserResponse) => {
        this._loader.hideLoader();
        this._router.navigate(['/home']);
      },
      error: (err) => {
        this._loader.hideLoader();
        this._toastService.error(
          this._translate.instant( err.error.message || 'login.errors.invalid-credentials'),
          { duration: 3000 }
        );
      },
    });
  }

  public onRecoverPassword() {
    this._router.navigate(['/forgot-password']);
  }
}
