import { Component, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  LayoutContentComponent,
  ItemListComponent,
  AvatarProfileComponent,
  UserAvatarComponent,
} from '@monorepo-bb-app/ui';
import { PROFILE_MENU_ITEMS, OPTIONS_PROFILE_MENU } from '../../constants/profile-menu.constants';
import { addIcons } from 'ionicons';
import {
  chatbox,
  chatboxEllipsesOutline,
  copyOutline,
  logInOutline,
  trashSharp,
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { LoaderUIService, LocalStorageService, SesionService, UserService } from '@monorepo-bb-app/core';
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
    UserAvatarComponent,
  ],
})
export class ProfileComponent {
  menuItems = PROFILE_MENU_ITEMS;
  menuOptions = OPTIONS_PROFILE_MENU;
  constructor(
    private router: Router,
    private loaderUIService: LoaderUIService,
    private localStorageService: LocalStorageService,
    public sesionService: SesionService,
    private stripeService: StripeService,
    
  ) {
    effect(() => {
      const user = this.sesionService.user$();
    });
    addIcons({
      trashSharp,
      chatbox,
      chatboxEllipsesOutline,
      logInOutline,
      copyOutline,
    });
  }

  onMenuItemClick(action: string): void {
    switch (action) {
      case 'personalData':
        this.personalData();
        break;
      case 'paymentMethod':
        this.router.navigate(['home/profile/payment-methods']);
        break;
      case 'mySubscriptions':
        this.router.navigate(['home/profile/my-subscriptions']);
        break;
      case 'themeColor':
        this.changeThemeColor();
        break;
      case 'terms':
        this.showTerms();
        break;
      case 'support':
        this.router.navigate(['home/profile/home-support']);
        break;
      case 'deleteAccount':
        this.deleteAccount();
        break;
      case 'logout':
        this.logout();
        break;
      case 'becomeCreator':
        this.router.navigate(['home/profile/become-creator-detail']);
        break;
      case 'bookmarks':
        this.router.navigate(['home/workouts/favorites']);
        break;
      case 'messages':
        this.router.navigate(['home/user-conversations']);
        break;
    }
  }

  private personalData(): void {
    this.router.navigate(['home/profile/personal-data']);
  }

  private navigateToMyClients(): void {
    // Implementar navegación a clientes
  }

  private changeThemeColor(): void {
    // Implementar cambio de color
  }

  private showTerms(): void {
    // Implementar mostrar términos
  }

  private contactSupport(): void {
    // Implementar contacto con soporte
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
