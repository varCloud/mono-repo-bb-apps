import { Component, effect, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoaderComponent, NoConnectionModalComponent } from '@monorepo-bb-app/ui';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

import {
  DeepLinkService,
  LoaderUIService,
  NetworkService,
  PushNotificationService,
  ThemeService,
  TranslationService,
} from '@monorepo-bb-app/core';


@Component({
  standalone: true,
  imports: [RouterModule, IonRouterOutlet, IonApp, LoaderComponent, NoConnectionModalComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'creator';
  public isLoading = signal(false);
  public showNoConnection = this._networkService.showNoConnectionModal;
  
  constructor(
    public globalBlockUIService: LoaderUIService,
    private pushNotificationService: PushNotificationService,
    private _themeService: ThemeService,
    private _translationService: TranslationService,
    private _deepLinkService: DeepLinkService,
    private _networkService: NetworkService
  ) {
    this._themeService.initializeTheme();
    this._translationService.setDefaultConfig();
    this.pushNotificationService.initPushNotifications();
    this._deepLinkService.initialize();
    
    effect(() => {
      const blockUIState = this.globalBlockUIService.getLoading();
      this.showNoConnection = this._networkService.showNoConnectionModal;
      if (blockUIState) {
        this.isLoading.set(true);
      } else {
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Llamado cuando el usuario da click en "Reintentar" en el modal de sin conexión
   */
  async onRetryConnection(): Promise<void> {
    await this._networkService.onRetryConnection();
  }
}
