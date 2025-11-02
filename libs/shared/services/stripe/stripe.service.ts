import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

import { loadStripe } from '@stripe/stripe-js';
import { environment } from '../../environment/environment';
import { Browser } from '@capacitor/browser';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  public stripe: any;
  public BASE_URL = `${environment.API_URL}`;

  private browserFinishedListener: any;
  private appUrlOpenListener: any;

  isSuccesOnbording = signal<boolean>(false);

  constructor(private _http: HttpClient) {
    this.initStripe();
  }

  async initStripe() {
    this.stripe = await loadStripe(environment.STRIPE_PUBLISHABLE_KEY);
  }

  public getSetupIntents(customerId: string) {
    return this._http.get(`${this.BASE_URL}/user/${customerId}/setup-intents`);
  }

  public getAccountLink(userId: number) {
    return this._http.get(
      `${this.BASE_URL}/user/${userId}/create-link-onboarding`
    );
  }

  private removeListeners() {
    if (this.browserFinishedListener) this.browserFinishedListener.remove();
    if (this.appUrlOpenListener) this.appUrlOpenListener.remove();
  }

  async openStripeOnboarding(idcreator: number) {
    this.getAccountLink(idcreator).subscribe(
      async (resp: any) => {
        const { url } = resp.data;
        await Browser.open({
          url,
        });
        this.browserFinishedListener = Browser.addListener(
          'browserFinished',
          () => {
            this.removeListeners();
            this.isSuccesOnbording.set(true);
          }
        );
      },
      (error) => {
        this.isSuccesOnbording.set(false);
      }
    );
  }
}
