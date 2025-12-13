import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import {
  LoaderUIService,
  NetworkService,
  PushNotificationService,
  ThemeService,
  TranslationService,
} from '@monorepo-bb-app/core';
import { LoaderComponent, NoConnectionModalComponent } from '@monorepo-bb-app/ui';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
  imports: [RouterModule, IonRouterOutlet, IonApp, LoaderComponent, NoConnectionModalComponent],
})
export class App implements OnInit {
  protected title = 'athlete';
  public isLoading = signal(false);
  public showNoConnection = this._networkService.showNoConnectionModal;
  
  constructor(
    public globalBlockUIService: LoaderUIService,
    private pushNotificationService: PushNotificationService,
    private _themeService: ThemeService,
    private _translationService: TranslationService,
    private _networkService: NetworkService
  ) {
    this._themeService.initializeTheme();
    this._translationService.setDefaultConfig();
    this.pushNotificationService.initPushNotifications();
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

  async ngOnInit(): Promise<void> {
    try {
      await ScreenOrientation.lock({ orientation: 'portrait' });
      if (
        Capacitor.isNativePlatform() &&
        Capacitor.getPlatform() === 'android'
      ) {
        StatusBar.setOverlaysWebView({ overlay: false });
      }
    } catch (error) {
      console.log('Error unlocking orientation:', error);
    }
  }
}
