import { Component, effect, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '@monorepo-bb-app/ui';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

import {
  DeepLinkService,
  LoaderUIService,
  PushNotificationService,
  ThemeService,
  TranslationService,
} from '@monorepo-bb-app/core';


@Component({
  standalone: true,
  imports: [RouterModule, IonRouterOutlet, IonApp, LoaderComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'creator';
  public isLoading = signal(false);
  constructor(
    public globalBlockUIService: LoaderUIService,
    private pushNotificationService: PushNotificationService,
    private _themeService: ThemeService,
    private _translationService: TranslationService,
    private _deepLinkService: DeepLinkService
  ) {
    this._themeService.initializeTheme();
    this._translationService.setDefaultConfig();
    this.pushNotificationService.initPushNotifications();
    this._deepLinkService.initialize();
    
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
