import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'libs/shared/environment/environment';
import { API_URLS } from '@monorepo-bb-app/shared';

@Injectable({
  providedIn: 'root',
})
export class SuscriptionService {
  private BASE_URL = environment.API_URL;
  constructor(private _http: HttpClient) {}

  public createSuscription(data: {
    creatorId: number;
    athleteId: number;
    userBillingCycleId: number;
    paymentMethodId: string;
  }) {
    return this._http.post(`${this.BASE_URL}${API_URLS.SUSCRIPTIONS}`, data);
  }
}
