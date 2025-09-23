import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  IonContent,
  IonGrid,
  IonButton,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutContentComponent , OtpComponent} from '@monorepo-bb-app/ui';
import { Router } from '@angular/router';
import { API_URLS } from '@monorepo-bb-app/shared';


@Component({
  selector: 'app-validate-otp-reset-password',
  templateUrl: './validate-otp-reset-password.component.html',
  styleUrls: ['./validate-otp-reset-password.component.scss'],
  imports: [
    IonButton,
    IonGrid,
    IonContent,
    TranslateModule,
    LayoutContentComponent,
    ReactiveFormsModule,
    OtpComponent,
  ],
})
export class ValidateOtpResetPasswordComponent implements OnInit {
  public readonly BASE_URL = `${API_URLS.FORGOT_PASSWORD}`;
  
  public otpForm!: FormGroup;
  public email: string = '';
  public otp: string = '';
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
}
