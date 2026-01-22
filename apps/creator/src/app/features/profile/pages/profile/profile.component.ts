import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  LayoutContentComponent,
  ItemListComponent,
  AvatarProfileComponent,
} from '@monorepo-bb-app/ui';
import { PROFILE_MENU_ITEMS } from '../../constants/profile-menu.constants';
import { addIcons } from 'ionicons';
import {
  chatbox,
  chatboxEllipsesOutline,
  copyOutline,
  logInOutline,
  trashSharp,
} from 'ionicons/icons';
import { Router } from '@angular/router';
import {
  LoaderUIService,
  LocalStorageService,
  SesionService,
} from '@monorepo-bb-app/core';
import { StripeService } from '@monorepo-bb-app/shared';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutContentComponent,
    ItemListComponent,
    AvatarProfileComponent,
  ],
})
export class ProfileComponent implements OnInit {
  menuItems = PROFILE_MENU_ITEMS;

  constructor(
    private router: Router,
    private loaderUIService: LoaderUIService,
    private localStorageService: LocalStorageService,
    public sesionService: SesionService,
    private _stripeService: StripeService
  ) {
    addIcons({
      trashSharp,
      chatbox,
      chatboxEllipsesOutline,
      logInOutline,
      copyOutline,
    });
  }

  ngOnInit() {}

  openStripeOnboarding() {
    this.router.navigate(['/stripe-onbording']);
  }

  onMenuItemClick(action: string): void {

    switch (action) {
      case 'viewAsClient':
        this.viewAsClient();
        break;
      case 'personalData':
        this.personalData();
        break;
      case 'portada':
        this.navigateToPortada();
        break;
      case 'bankInfo':
        this.navigateToBankInfo();
        break;
      case 'terms':
        this.showTerms();
        break;
      case 'support':
        this.contactSupport();
        break;
      case 'deleteAccount':
        this.deleteAccount();
        break;
      case 'logout':
        this.logout();
        break;
    }
  }

  public messages(): void {
    this.router.navigate(['home/user-conversations']);
  }

  private viewAsClient(): void {
    this.router.navigate(['home/profile/creator-profile']);
  }

  private personalData(): void {
    this.router.navigate(['home/profile/personal-data']);
  }

  private navigateToPortada(): void {
    this.router.navigate(['home/profile/portada']);
  }

  private navigateToBankInfo(): void {   
    this.loaderUIService.showLoader();
    setTimeout(() => {
      this.loaderUIService.hideLoader();
    }, 300);
    this._stripeService.openStripeOnboarding(this.sesionService.user$().userId);
  
  }

  private showTerms(): void {
    // Implementar mostrar términos
  }

  private contactSupport(): void {
     this.router.navigate(['home/profile/support-creator']);
  }

  private deleteAccount(): void {
    // Implementar eliminación de cuenta
  }

  private logout(): void {
    this.loaderUIService.showLoader();
    setTimeout(async () => {
      this.localStorageService.clear();
      await this.router.navigate(['login']);
      this.loaderUIService.hideLoader();
    }, 300);
  }
}
