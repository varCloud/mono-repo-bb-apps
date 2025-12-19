import { Component, effect, OnInit, signal } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import {
  LoaderUIService,
  PushNotificationService,
  ThemeService,
  TranslationService,
} from '@monorepo-bb-app/core';
import { LoaderComponent } from '@monorepo-bb-app/ui';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
  imports: [RouterModule, IonRouterOutlet, IonApp, LoaderComponent],
})
export class App implements OnInit {
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

  async ngOnInit(): Promise<void> {
    try {
      await ScreenOrientation.lock({ orientation: 'portrait' });
      const overlay = Capacitor.getPlatform() === 'ios';
      await StatusBar.setOverlaysWebView({ overlay });
    } catch (error) {
      console.log('Error unlocking orientation:', error);
    }
  }
}
