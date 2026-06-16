import { Component, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  LayoutContentComponent,
  ItemListComponent,
  AvatarProfileComponent,
  DeleteAccountModalComponent,
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
import { AppSettingsService, LoaderUIService, LocalStorageService, SesionService, UserService } from '@monorepo-bb-app/core';
import { StripeService, ToastService } from '@monorepo-bb-app/shared';


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
export class ProfileComponent {
  menuItems = PROFILE_MENU_ITEMS;
  menuOptions = OPTIONS_PROFILE_MENU;
  constructor(
    private router: Router,
    private loaderUIService: LoaderUIService,
    private localStorageService: LocalStorageService,
    public sesionService: SesionService,
    private stripeService: StripeService,
    private userService: UserService,
    private toastService: ToastService,
    private modalCtrl: ModalController,
    private translate: TranslateService,
    private appSettingsService: AppSettingsService,
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
      case 'payments':
        this.router.navigate(['home/profile/payments']);
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
    this.openDeleteAccountModal();
  }

  private async openDeleteAccountModal(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: DeleteAccountModalComponent,
      breakpoints: [0.5, 1],
      initialBreakpoint: 0.5,
      handle: false,
      cssClass: 'bottom-sheet-modal-rounded',
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();

    if (role === 'confirm' && data?.confirmDelete) {
      await this.performDeleteAccount();
    }
  }

  private async performDeleteAccount(): Promise<void> {
    const userId = this.sesionService.user$()?.userId;
    
    if (!userId) {
      await this.toastService.error(this.translate.instant('delete-account.user-error'));
      return;
    }

    this.loaderUIService.showLoader();

    try {
      await this.userService.deleteAccount(userId).toPromise();
      
      this.loaderUIService.hideLoader();
      await this.toastService.success(this.translate.instant('delete-account.success-message'));
      
      // Limpiar datos locales y redirigir al login
      setTimeout(async () => {
        this.localStorageService.clear();
        await this.router.navigate(['login']);
      }, 500);
    } catch (error) {
      this.loaderUIService.hideLoader();
      console.error('Error al eliminar la cuenta:', error);
      await this.toastService.error(this.translate.instant('delete-account.error-message'));
    }
  }

  private logout(): void {
    this.loaderUIService.showLoader();
    this.appSettingsService.clearSettings();
    setTimeout(async () => {
      this.localStorageService.clear();
      await this.router.navigate(['login']);
      this.loaderUIService.hideLoader();
    }, 300);
  }
}
