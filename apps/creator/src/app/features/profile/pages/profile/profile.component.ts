import { LoggerService } from 'libs/core/services/logger.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
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
  shareSocialOutline,
} from 'ionicons/icons';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LoaderUIService,
  LocalStorageService,
  SesionService,
  UserService,
} from '@monorepo-bb-app/core';
import {
  KEY_LOCALSTORAGE,
  ShareService,
  StripePropertiesAccount,
  StripeService,
  StripeStatus,
  ToastService,
  User,
} from '@monorepo-bb-app/shared';
import { finalize, take } from 'rxjs';

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
  public webLinkCreatorProfile = '';
  public showMessageStripeIncomplete = true;
  constructor(
    private router: Router,
    private loaderUIService: LoaderUIService,
    private localStorageService: LocalStorageService,
    public sesionService: SesionService,
    private toastService: ToastService,
    private shareService: ShareService,
    private _stripeService: StripeService,
    private route: ActivatedRoute,
    private _userService: UserService,
    private _navCtrl: NavController
  ) {
    addIcons({
      trashSharp,
      chatbox,
      chatboxEllipsesOutline,
      logInOutline,
      copyOutline,
      shareSocialOutline,
    });
    this.route.queryParams.subscribe(async (params) => {
      if (params['stripe'] === 'success') {
        const user = await this.localStorageService.get(KEY_LOCALSTORAGE.USER);
        this.loaderUIService.showLoader();
        this._userService
          .statusAccountPaymentStripe(user.userId)
          .pipe(finalize(() => this.loaderUIService.hideLoader()))
          .subscribe({
            next: async (account: StripePropertiesAccount) => {
              if (account.isFullyActive) {
                this.showMessageStripeIncomplete = false;
                this.localStorageService.set(KEY_LOCALSTORAGE.USER, {
                  ...user,
                  stripeStatus: StripeStatus.ACTIVE,
                });
                this.toastService.success('¡Configuración de Stripe completada con éxito!', {
                  duration: 2000,
                });
              } else {
                this.errorSatusStripe();
              }
            },
            error: () => {
              this.errorSatusStripe();
            },
          });
      }
    });
  }

  private async errorSatusStripe() {
    const user = await this.localStorageService.get(KEY_LOCALSTORAGE.USER);
    this.showMessageStripeIncomplete = true;
    this.localStorageService.set(KEY_LOCALSTORAGE.USER, {
      ...user,
      stripeStatus: StripeStatus.RESTRICTED,
    });
  }

  async ngOnInit() {
    const config = await this.localStorageService.get(KEY_LOCALSTORAGE.CONFIG);
    if (config) {
      this.webLinkCreatorProfile = `${config.creatorSiteProfile}?userId=${this.sesionService.user$().userId}`;
    }
  }

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
      case 'payments':
        this.router.navigate(['home/profile/payments']);
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
      case 'copyLink':
        this.onCopyLink();
        break;
      case 'shareLink':
        this.onShareLink();
        break;
      case 'logout':
        this.logout();
        break;
      case 'openLink':
        this.openLink();
        break;
    }
  }

  public openLink(): void{
    window.open(this.webLinkCreatorProfile, '_blank');
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
    this.router.navigate(['home/profile/terms-conditions']);
  }

  private contactSupport(): void {
    this.router.navigate(['home/profile/support-creator']);
  }

  private deleteAccount(): void {
    // Implementar eliminación de cuenta
  }

  private async onCopyLink(): Promise<void> {
    try {
      await this.shareService.copyToClipboard(this.webLinkCreatorProfile);
      this.toastService.success('Enlace copiado al portapapeles');
    } catch {
      this.toastService.error('Error al copiar el enlace');
    }
  }

  private async onShareLink(): Promise<void> {
    try {
      await this.shareService.share({
        title: 'Mi perfil de creador',
        text: `Mira mi perfil: ${this.sesionService.user$().firstName}`,
        url: this.webLinkCreatorProfile,
        dialogTitle: 'Compartir perfil',
      });
    } catch {
      await this.onCopyLink();
    }
  }

  private logout(): void {
    this.loaderUIService.showLoader();
    setTimeout(async () => {
      await this.localStorageService.clear([KEY_LOCALSTORAGE.TOKEN_PUSH]);
      await this.localStorageService.clear();
      await this._navCtrl.navigateRoot(['login'], { replaceUrl: true });
      this.loaderUIService.hideLoader();
    }, 300);
  }
}
