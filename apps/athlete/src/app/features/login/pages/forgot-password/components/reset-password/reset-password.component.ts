import { Component, OnInit } from '@angular/core';
import { ResetPasswordFormComponent, LayoutContentComponent } from '@monorepo-bb-app/ui';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ToastService } from '@monorepo-bb-app/shared';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  imports: [
    ResetPasswordFormComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    LayoutContentComponent,
  ],
})
export class ResetPasswordComponent implements OnInit {
  public email: string = '';
  constructor(
    private readonly router: Router,
    private _toastService: ToastService,
    private _translate: TranslateService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    const navigationExtras = navigation?.extras;
    this.email = navigationExtras?.state?.['email'] || '';
  }

  ngOnInit() {}
  public onResetSuccess(success: boolean) {
    if (success) {
      this._toastService.success(
        this._translate.instant('reset-password.password-reset-success'),
      );
      this.router.navigate(['/login']);
    } else {
      console.error(
        this._translate.instant('reset-password.password-reset-failed'),
      );
    }
  }
}