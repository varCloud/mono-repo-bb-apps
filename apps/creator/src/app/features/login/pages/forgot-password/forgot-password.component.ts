import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonButton,
  IonText,
  IonImg,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutContentComponent } from '@monorepo-bb-app/ui';
import { Router } from '@angular/router';
import { LoaderUIService } from '@monorepo-bb-app/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  imports: [
    IonImg,
    IonText,
    IonButton,
    IonInput,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    TranslateModule,
    LayoutContentComponent,
    ReactiveFormsModule,
  ],
})
export class ForgotPasswordComponent implements OnInit {
  
  public forgotPasswordForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _loaderService: LoaderUIService,
  ) {}

  ngOnInit() {
    this.initForm();
    this._loaderService.showLoader();
    setTimeout(() => {
      this._loaderService.hideLoader();
    }, 5000); // Simulate a delay for loading
  }

  private initForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(50)],
      ],
    });
  }

  public onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this._loaderService.showLoader();
      const navigationExtras = {
        state: {
          email: this.forgotPasswordForm.value.email,
        },
      };
      this.router.navigate(['/validate-otp-forgot-password'], navigationExtras);
    } else {
      // Handle form errors
      console.error('Form is invalid');
    }
  }
}
