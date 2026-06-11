import { Component, OnDestroy, output, input } from '@angular/core';
import { Browser } from '@capacitor/browser';
import {
  KEY_LOCALSTORAGE,
  StripePropertiesAccount,
  StripeService,
  StripeStatus,
} from '@monorepo-bb-app/shared';
import {
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonText,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cardOutline,
  checkmarkCircle,
  informationCircle,
  lockClosed,
  shieldCheckmark,
  trendingUp,
} from 'ionicons/icons';
import {
  LoaderUIService,
  LocalStorageService,
  UserService,
} from '@monorepo-bb-app/core';
import { finalize } from 'rxjs';
import { StripeIdentificationWarningModalComponent } from '../stripe-identification-warning-modal/stripe-identification-warning-modal.component';

@Component({
  selector: 'lib-onbording',
  templateUrl: './onbording.component.html',
  styleUrls: ['./onbording.component.scss'],
  imports: [IonButton, IonIcon, IonCard, IonCardContent, IonText],
})
export class OnbordingComponent implements OnDestroy {
  userId = input.required<number>();
  isSuccesOnbording = output<boolean>();
  skipOnboarding = output<boolean>();

  private browserFinishedListener: any;
  private appUrlOpenListener: any;

  constructor(
    private _stripeService: StripeService,
    private _loader: LoaderUIService,
    private _userService: UserService,
    private _localStorage: LocalStorageService,
    private _modalCtrl: ModalController
  ) {
    addIcons({
      cardOutline,
      checkmarkCircle,
      shieldCheckmark,
      trendingUp,
      informationCircle,
      lockClosed,
    });
  }

  ngOnDestroy() {
    this.removeListeners();
  }

  private removeListeners() {
    if (this.browserFinishedListener) this.browserFinishedListener.remove();
    if (this.appUrlOpenListener) this.appUrlOpenListener.remove();
  }

  skipForNow() {
    this.skipOnboarding.emit(true);
  }

  startStripeOnboarding() {
    this._loader.showLoader();
    this._userService
      .statusAccountPaymentStripe(this.userId())
      .pipe(finalize(() => this._loader.hideLoader()))
      .subscribe({
        next: (account: StripePropertiesAccount) => {
          if (account.isFullyActive) {
            this.updateCreatorStripeStatus();
          } else {
            this.showIdentificationWarningModal();
          }
        },
        error: () => {
          this.showIdentificationWarningModal();
        },
      });
  }

  private updateCreatorStripeStatus() {
    this._loader.showLoader();
    this._userService
      .updateUser(this.userId(), { stripeStatus: StripeStatus.ACTIVE })
      .pipe(finalize(() => this._loader.hideLoader()))
      .subscribe({
        next: async () => {
          await this.setStripeStatusActiveInLocalStorage();
          this.isSuccesOnbording.emit(true);
        },
        error: () => {
          this.isSuccesOnbording.emit(false);
        },
      });
  }

  private async setStripeStatusActiveInLocalStorage(): Promise<void> {
    const user = await this._localStorage.get(KEY_LOCALSTORAGE.USER);
    await this._localStorage.set(KEY_LOCALSTORAGE.USER, {
      ...user,
      stripeStatus: StripeStatus.ACTIVE,
    });
  }

  private async showIdentificationWarningModal(): Promise<void> {
    const modal = await this._modalCtrl.create({
      component: StripeIdentificationWarningModalComponent,
      breakpoints: [0.8, 1],
      initialBreakpoint: 0.8,
      handle: false,
      cssClass: 'bottom-sheet-modal-rounded',
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();

    if (role === 'confirm' && data?.continue) {
      this.openStripeOnboarding();
    }
  }

  async openStripeOnboarding() {
    this._stripeService.getAccountLink(this.userId()).subscribe(
      async (resp: any) => {
        const { url } = resp.data;
        await Browser.open({
          url,
        });
        this.browserFinishedListener = Browser.addListener(
          'browserFinished',
          () => {
            this.removeListeners();
            this.checkStatus();
          }
        );
      },
      (_error) => {
        this.isSuccesOnbording.emit(false);
      }
    );
  }

  checkStatus() {
    this._loader.showLoader();
    this._userService
      .statusAccountPaymentStripe(this.userId())
      .pipe(finalize(() => this._loader.hideLoader()))
      .subscribe({
        next: async (account: StripePropertiesAccount) => {
          console.log(account);
          if (account.isFullyActive) {
            this.isSuccesOnbording.emit(true);
            await this.setStripeStatusActiveInLocalStorage();
          } else {
            this.isSuccesOnbording.emit(false);
          }
        },
        error: () => {
          this.isSuccesOnbording.emit(false);
        },
      });
  }
}
