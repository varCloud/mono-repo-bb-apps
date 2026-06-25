import { Component, effect, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppSettingsService, AppVersionService, ProfileColorService, UserConversationService, UserService } from '@monorepo-bb-app/core';
import { AppUpdateModalComponent } from '@monorepo-bb-app/ui';
import { environment } from '@monorepo-bb-app/shared';
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
  imports: [IonText, IonTabs, IonTabBar, IonTabButton, IonIcon, IonContent, IonBadge, RouterLink],
})
export class HomeComponent implements OnInit, OnDestroy {
  private _pollSub?: Subscription;
  private _updateChecked = false;

  constructor(
    private router: Router,
    public colorService: ProfileColorService,
    private _userService: UserService,
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
        this._userService.updatePushTokenIfSessionActive();
    })

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
    const storeUrl = await this._appVersionService.getRequiredUpdate('creator');
    return
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
    this.router.navigateByUrl('/home/profile');
  }
}
