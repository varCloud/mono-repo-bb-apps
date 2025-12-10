import { Component, effect, signal, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '@monorepo-bb-app/ui';
import { IonApp, IonRouterOutlet, ModalController } from '@ionic/angular/standalone';
import { ConnectionDetectorService } from '@monorepo-bb-app/core';
import { ConnectionDetectorComponent } from '@monorepo-bb-app/ui';


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
  private networkService = inject(ConnectionDetectorService);
  private modalCtrl = inject(ModalController);
  private offlineModal: HTMLIonModalElement | null = null;



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
      const isOnline = this.networkService.isOnline();
      this.handleNetworkChange(isOnline);
    });


    effect(() => {
      const blockUIState = this.globalBlockUIService.getLoading();
      if (blockUIState) {
        this.isLoading.set(true);
      } else {
        this.isLoading.set(false);
      }
    });
  }

async handleNetworkChange(isOnline: boolean) {
    if (!isOnline) {
      if (!this.offlineModal) {
        await this.presentOfflineModal();
      }
    } else {
      if (this.offlineModal) {
        await this.offlineModal.dismiss();
        this.offlineModal = null;
      }
    }
  }

  async presentOfflineModal() {
    this.offlineModal = await this.modalCtrl.create({
      component: ConnectionDetectorComponent,
      backdropDismiss: false,
      cssClass: 'offline-modal',
      breakpoints: [0, .6],
      initialBreakpoint: .6
    });

    await this.offlineModal.present();
    const { role } = await this.offlineModal.onDidDismiss();
    if (role !== 'gesture') {
       this.offlineModal = null;
    }
  }

}
