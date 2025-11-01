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
    private _localStorage: LocalStorageService
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
    this.openStripeOnboarding();
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
            const user = await this._localStorage.get(KEY_LOCALSTORAGE.USER);
            this._localStorage.set(KEY_LOCALSTORAGE.USER, {
              ...user,
              stripeStatus: StripeStatus.ACTIVE,
            });
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
