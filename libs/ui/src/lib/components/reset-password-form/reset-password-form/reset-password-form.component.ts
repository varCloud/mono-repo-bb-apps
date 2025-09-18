import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { BlockUIModule } from 'ng-block-ui';
import { CONSTANTS } from '@monorepo-bb-app/shared';
import { PATTERNS } from '@monorepo-bb-app/shared';
import { ForgotPasswordService, LoaderService } from '@monorepo-bb-app/core';

@Component({
  selector: 'app-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    BlockUIModule,
  ],
})
export class ResetPasswordFormComponent implements OnInit {
  public email = input.required<string>();
  public resetPasswordForm: FormGroup;
  public resetSuccess = output<boolean>();
  constructor(
    private formBuilder: FormBuilder,
    private forgotPasswordService: ForgotPasswordService,
    private _loaderService: LoaderService,
  ) {
    this.resetPasswordForm = this.formBuilder.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(PATTERNS.PASSWORD),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  ngOnInit() {}

  passwordMatchValidator(
    control: AbstractControl,
  ): { [key: string]: any } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      const formValue = this.resetPasswordForm.value;

      const Payload = {
        email: this.email(),
        newPassword: formValue.password,
        userTypeId: CONSTANTS.USER_TYPE_ID,
      };

      this.forgotPasswordService.resetPassword(Payload).subscribe(
        (response:any) => {
          this._loaderService.hideSpinner();
          this.resetSuccess.emit(true);
        },
        (error:any) => {
          this.resetSuccess.emit(false);
        },
      );
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.resetPasswordForm.controls).forEach((key) => {
      const control = this.resetPasswordForm.get(key);
      control?.markAsTouched();
    });
  }
}
