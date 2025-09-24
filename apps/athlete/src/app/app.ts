import { Component, effect, OnInit, signal } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

import {
  LoaderUIService,
  PushNotificationService,
  ThemeService,
  TranslationService,
} from '@monorepo-bb-app/core';
import { LoaderComponent } from '@monorepo-bb-app/ui';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
  imports: [RouterModule, IonRouterOutlet, IonApp, LoaderComponent],
  
})
export class App  {
  protected title = 'creator';
  public isLoading = signal(false);
  constructor(
    public globalBlockUIService: LoaderUIService,
    private pushNotificationService: PushNotificationService,
    private _themeService: ThemeService,
    private _translationService: TranslationService
  ) {
    this._themeService.initializeTheme();
    this._translationService.setDefaultConfig();
    this.pushNotificationService.initPushNotifications();
    effect(() => {
      const blockUIState = this.globalBlockUIService.getLoading();
      if (blockUIState) {
        this.isLoading.set(true);
      } else {
        this.isLoading.set(false);
      }
    });
  }
}
