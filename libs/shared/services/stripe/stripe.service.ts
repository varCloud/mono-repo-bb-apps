import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { loadStripe } from '@stripe/stripe-js';
import { environment } from '../../environment/environment';


@Injectable({
  providedIn: 'root',
})
export class StripeService {
  public stripe: any;
  public BASE_URL = `${environment.API_URL}`;

  constructor(private _http: HttpClient) {
    this.initStripe();
  }

  async initStripe() {
    this.stripe = await loadStripe(environment.STRIPE_PUBLISHABLE_KEY);
  }

  public getSetupIntents(customerId: string) {
    //TODO: Cambiar nombre cuando se implemente el backend
    return this._http.post(`${this.BASE_URL}/user/setupIntents`, {
      id: customerId,
    });
  }

  public getAccountLink(userId: number) {
    return this._http.get(
      `${this.BASE_URL}/user/${userId}/create-link-onboarding`,
    );
  }
}
