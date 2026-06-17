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
} from '@ionic/angular/standalone';
import { AppSettingsService, SesionService, UserConversationService, UserService } from '@monorepo-bb-app/core';
import { TabMenuService } from '@monorepo-bb-app/core';
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
  constructor(
    private router: Router,
    private _userService: UserService,
    private _sesionService: SesionService,
    private _tabMenuService: TabMenuService,
    public userConversationService: UserConversationService,
    private _appSettingsService: AppSettingsService,
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
