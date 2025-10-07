import { Component, OnInit } from '@angular/core';
import {
  IonContent,
  IonGrid,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutContentComponent, EmailInputFormComponent } from '@monorepo-bb-app/ui';
import { Router } from '@angular/router';
import { LoaderUIService } from '@monorepo-bb-app/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  imports: [
    IonContent,
    IonGrid,
    TranslateModule,
    LayoutContentComponent,
    EmailInputFormComponent,
  ],
})
export class ForgotPasswordComponent implements OnInit {
  
  constructor(
    private router: Router,
    private _loaderService: LoaderUIService,
  ) {}

  ngOnInit() {}

  public onEmailSubmit(email: string) {
    this._loaderService.showLoader();
    const navigationExtras = {
      state: { email },
    };
    this.router.navigate(['/validate-otp-forgot-password'], navigationExtras);
  }
}