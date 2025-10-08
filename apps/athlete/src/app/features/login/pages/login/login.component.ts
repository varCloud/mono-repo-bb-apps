import { Component, OnInit } from '@angular/core';
import {
  IonButton,
  IonRow,
  IonCol,
  IonGrid,
  IonText,
  IonContent,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderComponent, LayoutContentComponent, LoginFormComponent } from '@monorepo-bb-app/ui';

import { LoginService } from '../../services/login.service';
import {
  LoginCredentials,
  UserResponse,
  ToastService,
} from '@monorepo-bb-app/shared';
import { Router, RouterLink } from '@angular/router';
import { LoaderUIService } from '@monorepo-bb-app/core';
import { ENUM_TYPE_USER } from 'libs/shared/constants/enums';

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
  public userType =  ENUM_TYPE_USER.ATHLETE;
  constructor(
    private _loginService: LoginService,
    private _toastService: ToastService,
    private _translate: TranslateService,
    private _router: Router,
    private _loader: LoaderUIService
  ) {}

  ngOnInit() {}

  public async onLogin(credentials: LoginCredentials) {
    this._loader.showLoader();

    this._loginService.login(credentials).subscribe({
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