import { Component, OnInit, OnDestroy, output, input } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { StripeService } from '@monorepo-bb-app/shared';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-onbording',
  templateUrl: './onbording.component.html',
  styleUrls: ['./onbording.component.scss'],
  imports: [IonButton],
})
export class OnbordingComponent implements OnDestroy {
  userId = input.required<number>();
  isSuccesOnbording = output<boolean>();

  private browserFinishedListener: any;
  private appUrlOpenListener: any;

  constructor(private _stripeService: StripeService) {}

  ngOnDestroy() {
    this.removeListeners();
  }

  private removeListeners() {
    if (this.browserFinishedListener) this.browserFinishedListener.remove();
    if (this.appUrlOpenListener) this.appUrlOpenListener.remove();
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
            this.isSuccesOnbording.emit(false);
          },
        );
      },
      (error) => {
        this.isSuccesOnbording.emit(false);
      },
    );
  }
}
