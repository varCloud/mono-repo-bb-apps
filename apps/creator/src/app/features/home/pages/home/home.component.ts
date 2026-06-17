import { Component, effect, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppSettingsService, ProfileColorService, UserConversationService, UserService } from '@monorepo-bb-app/core';
import { environment } from '@monorepo-bb-app/shared';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonContent,
  IonText,
  IonBadge,
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

  constructor(
    private router: Router,
    public colorService: ProfileColorService,
    private _userService: UserService,
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
        this._userService.updatePushTokenIfSessionActive();
    })
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
