import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  IonContent,
  IonGrid,
  IonCol,
  IonRow,
  IonText,
  IonButton,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent, LayoutContentComponent, CreateAccountFormComponent } from '@monorepo-bb-app/ui';
import { CreateAccountService } from '../../services/create-account.service';
import { UserCreateAccountPayload } from '@monorepo-bb-app/shared';
import { Router, RouterLink } from '@angular/router';
import { LoaderUIService } from '@monorepo-bb-app/core';
import { ENUM_TYPE_USER } from 'libs/shared/constants/enums';

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
    IonContent,
    TranslateModule,
    LayoutContentComponent,
    HeaderComponent,
    CommonModule,
    CreateAccountFormComponent,
    RouterLink,
  ],
})
export class CreateAccountComponent implements OnInit {
  public userType = ENUM_TYPE_USER.ATHLETE;

  constructor(
    private createAccountService: CreateAccountService,
    private _router: Router,
    private _loader: LoaderUIService,
  ) {}

  ngOnInit() {}

  public onCreateAccount(payload: UserCreateAccountPayload) {
    this._loader.showLoader();
    
    if (!payload.email || !payload.passwordHash) {
      this._loader.hideLoader();
      return;
    }
    
    this.createAccountService.setUser(payload);
    this._loader.hideLoader();
    this._router.navigate(['/create-account/otp']);
  }
}