import { Component, OnInit, effect } from '@angular/core';
import { SesionService, UserService } from '@monorepo-bb-app/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonToggle,
  IonButton,
  IonRow,
  IonGrid,
  IonCol,
  IonInput,
  IonInputPasswordToggle,
  IonRouterLink,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '@monorepo-bb-app/core';
import { ThemeService } from '@monorepo-bb-app/core';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { HttpClient } from '@angular/common/http';
import { AddPaymentMethodComponent } from '@monorepo-bb-app/ui';
import { HeaderComponent } from '@monorepo-bb-app/ui';
import { ImageButtonComponent } from '@monorepo-bb-app/ui';
import { OnbordingComponent } from '@monorepo-bb-app/ui';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonRouterLink,
    IonButton,
    IonToggle,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    TranslateModule,
    IonToggle,
    AddPaymentMethodComponent,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    IonInputPasswordToggle,
    HeaderComponent,
    ImageButtonComponent,
    OnbordingComponent,
    RouterLink,
  ],
})
export class HomePage implements OnInit {
  token: any;
  private stripe: any;
  card: any;
  elements: any;
  isAlertOpen = false;

  showPaymentMethod = false;
  constructor(
    private _translateService: TranslationService,
    private _themeService: ThemeService,
    private http: HttpClient,
    private _userService: UserService,
    private _sesionService: SesionService
  ) {
      effect(() => {
      const user = this._sesionService.user$();
      console.log('Usuario en sesión:', this._sesionService.user$());
      this._userService.updatePushTokenIfSessionActive();
    });
  }

  async ngOnInit() {
    
  }

  changeLanguage(value: string) {
    this._translateService.changeLanguage(value);
  }

  toggleTheme(event: any) {
    if (event.detail.checked) {
      this._themeService.setTheme('dark');
    } else {
      this._themeService.setTheme('light');
    }
  }

  isDarkTheme() {
    return this._themeService.isDarkMode;
  }

  async googleLogin() {
    const res = await SocialLogin.login({
      provider: 'google',
      options: {},
    });
    this.token = res as any;
    // handle the response
    console.log(JSON.stringify(res));
  }

  async addCard() {
    this.showPaymentMethod = true;
  }

  succesAddPayment($event: { data: any }) {
    this.showPaymentMethod = false;
    console.log($event.data);
  }
}
