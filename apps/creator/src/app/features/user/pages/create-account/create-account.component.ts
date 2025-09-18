import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent,
  IonInput,
  IonGrid,
  IonCol,
  IonRow,
  IonButton,
  IonInputPasswordToggle,
  IonText,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent, LayoutContentComponent } from '@monorepo-bb-app/ui';
import { CreateAccountService } from '../../services/create-account.service';
import { UserCreateAccountPayload } from '../../models/user.interfaces';
import { Router, RouterLink } from '@angular/router';
import { LoaderUIService } from '@monorepo-bb-app/core';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
  imports: [
    IonText,
    IonButton,
    IonRow,
    IonCol,
    IonGrid,
    IonInput,
    IonContent,
    TranslateModule,
    LayoutContentComponent,
    HeaderComponent,
    CommonModule,
    ReactiveFormsModule,
    IonInputPasswordToggle,
    RouterLink,
  ],
})
export class CreateAccountComponent implements OnInit {
  createAccountForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    passwordHash: ['', [Validators.required, Validators.minLength(6)]],
  });
  constructor(
    private formBuilder: FormBuilder,
    private createAccountService: CreateAccountService,
    private _router: Router,
    private _loader: LoaderUIService,
  ) {}

  ngOnInit() {}

  public onCreateAccount() {
    if (this.createAccountForm.invalid) {
      this.createAccountForm.markAllAsTouched();
      return;
    }
    this._loader.showLoader();
    const formData = this.createAccountForm.value as UserCreateAccountPayload;
    if (!formData.email || !formData.passwordHash) {
      this._loader.hideLoader();
      return;
    }
    this.createAccountService.setUser(formData);
    this._loader.hideLoader();
    this._router.navigate(['/create-account/otp']);
  }
}
