import { Component, effect, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonContent,
  IonText,
  IonBadge,
  ModalController,
} from '@ionic/angular/standalone';
import { AppSettingsService, AppVersionService, SesionService, UserConversationService, UserService } from '@monorepo-bb-app/core';
import { TabMenuService } from '@monorepo-bb-app/core';
import { AppUpdateModalComponent } from '@monorepo-bb-app/ui';
import { environment } from '@monorepo-bb-app/shared';
import { App } from '@capacitor/app';
import { addIcons } from 'ionicons';
import {
  chatboxEllipsesOutline,
  homeOutline,
  personOutline,
  pricetagOutline,
} from 'ionicons/icons';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    IonText,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonContent,
    IonBadge,
    RouterLink],
})
export class HomeComponent implements OnInit, OnDestroy {
  public showMenu = true;
  private _pollSub?: Subscription;
  private _updateChecked = false;
  constructor(
    private router: Router,
    private _userService: UserService,
    private _sesionService: SesionService,
    private _tabMenuService: TabMenuService,
    public userConversationService: UserConversationService,
    private _appSettingsService: AppSettingsService,
    private _appVersionService: AppVersionService,
    private _modalCtrl: ModalController,
  ) {
    addIcons({
      homeOutline,
      chatboxEllipsesOutline,
      pricetagOutline,
      personOutline,
    });
    effect(() => {
      this.showMenu = this._tabMenuService.getShowMenu();
      console.log('Tab Menu Loading State:', this.showMenu);
      console.log('Usuario en sesión:', this._sesionService.user$());
      const user = this._sesionService.user$();
      this._userService.updatePushTokenIfSessionActive();
    });
    effect(() => {
      const settings = this._appSettingsService.settings$();
      if (settings && !this._updateChecked) {
        this._updateChecked = true;
        this.checkAppUpdate();
      }
    });
  }

  /** Muestra un modal bloqueante si hay una versión más reciente en la tienda. */
  private async checkAppUpdate() {
    const storeUrl = await this._appVersionService.getRequiredUpdate('athlete');
    return;
    if (!storeUrl) {
      return;
    }
    const modal = await this._modalCtrl.create({
      component: AppUpdateModalComponent,
      componentProps: { storeUrl },
      breakpoints: [0.5, 1],
      initialBreakpoint: 0.5,
      handle: false,
      cssClass: 'bottom-sheet-modal-rounded',
      backdropDismiss: false,
      canDismiss: false,
    });
    await modal.present();
  }

  ngOnInit() {
    this.userConversationService.refreshUnreadSummary();
    this.startUnreadPolling();
    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        this.userConversationService.refreshUnreadSummary();
        this.startUnreadPolling();
      } else {
        this.stopUnreadPolling();
      }
    });
  }

  ngOnDestroy() {
    this.stopUnreadPolling();
  }

  private startUnreadPolling() {
    if (this._pollSub) {
      return;
    }
    this._pollSub = interval(this.unreadPollMs).subscribe(() =>
      this.userConversationService.refreshUnreadSummary(),
    );
  }

  /** Intervalo de polling del badge, configurable desde AppSettings (unread_poll_ms). */
  private get unreadPollMs(): number {
    const fromSettings = Number(this._appSettingsService.settings$()?.unreadPollMs);
    return Number.isFinite(fromSettings) && fromSettings > 0
      ? fromSettings
      : environment.DEFAULT_UNREAD_POLL_MS;
  }

  private stopUnreadPolling() {
    this._pollSub?.unsubscribe();
    this._pollSub = undefined;
  }

  onRedirectTabButton(url: string) {
    console.log('Redirecting to:', url);
    this.router.navigateByUrl('/home/profile');
  }
}
