import { Component, OnInit } from '@angular/core';
import {
  IonContent,
  IonGrid,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutContentComponent , OtpComponent} from '@monorepo-bb-app/ui';
import { Router } from '@angular/router';
import { API_URLS } from '@monorepo-bb-app/shared';
import { ENUM_TYPE_USER } from 'libs/shared/constants/enums';

@Component({
  selector: 'app-validate-otp-reset-password',
  templateUrl: './validate-otp-reset-password.component.html',
  styleUrls: ['./validate-otp-reset-password.component.scss'],
  imports: [
    IonGrid,
    IonContent,
    TranslateModule,
    LayoutContentComponent,
    OtpComponent,
  ],
})
export class ValidateOtpResetPasswordComponent implements OnInit {
  public readonly BASE_URL = `${API_URLS.FORGOT_PASSWORD}`;
  
  public email: string = '';
  
  constructor(private readonly router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const navigationExtras = navigation?.extras;
    this.email = navigationExtras?.state?.['email'] || '';
  }

  ngOnInit() {}

  onOtpSuccess(event: any) {
    if (event) {
      this.router.navigate(['/reset-password-forgot-password'], {
        state: { email: this.email },
      });
    }
  }

  public get userTypeId(): number {
    return ENUM_TYPE_USER.ATHLETE; // Athlete
  }
}