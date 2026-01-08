import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { API_URLS } from '../../constants/api-urls';
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

  public cancelSuscription(suscriptionId: number) {
    return this._http.delete(`${this.BASE_URL}${API_URLS.SUSCRIPTIONS}/${suscriptionId}`);
  }
}
