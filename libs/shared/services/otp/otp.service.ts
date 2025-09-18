import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class OtpService {
  private _baseUrl = environment.API_URL;
  constructor(private _http: HttpClient) {}

  public getOtp({
    apiUrl,
    email,
    userTypeId = 2,
    params = {},
  }: {
    apiUrl: string;
    email: string;
    userTypeId: number;
    params?: Record<string, any>;
  }) {
    return this._http.post(`${this._baseUrl}${apiUrl}`, {
      email,
      userTypeId,
      ...params,
    });
  }

  public verifyOtp({
    apiUrl,
    email,
    otp,
    userTypeId = 2,
  }: {
    apiUrl: string;
    email: string;
    otp: string;
    userTypeId: number;
  }) {
    return this._http.post(`${this._baseUrl}${apiUrl}/validate`, {
      email,
      code: `${otp}`,
      userTypeId,
    });
  }
}
