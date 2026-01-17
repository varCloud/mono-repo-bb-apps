import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginCredentials, UserResponse } from '../models/user';
import {
  API_URLS,
  AppSettingsModel,
  Currency,
  environment,
  KEY_LOCALSTORAGE,
} from '@monorepo-bb-app/shared';

import { Router } from '@angular/router';
import { firstValueFrom, map, Observable, tap } from 'rxjs';
import {
  LocalStorageService,
  SesionService,
  UserService,
} from '@monorepo-bb-app/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private _baseUrl = environment.API_URL + API_URLS.LOGIN;

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _localStorage: LocalStorageService,
    private _sesionService: SesionService,
    private _userService: UserService
  ) {}

  public login(user: LoginCredentials): Observable<UserResponse> {
    return this._http.post<UserResponse>(`${this._baseUrl}/login`, user).pipe(
      tap(async (resp) => {
        await this._localStorage.set(KEY_LOCALSTORAGE.TOKEN, resp.token);
        await this._localStorage.set(
          KEY_LOCALSTORAGE.HAS_NULL_PROFILE_FIELDS,
          resp.hasNullProfileFields
        );
        this._userService.getUser(resp.userId).subscribe();
        const config = await this.getAppSettings();
        this._localStorage.set(KEY_LOCALSTORAGE.CONFIG, {
          ...config,
          currency: config.paymentCurrency,
        });
      })
    );
  }

  public async getAppSettings() {
    const settings = this._http
      .get(`${environment.API_URL}/app-settings`)
      .pipe(map((resp: any) => new AppSettingsModel(resp.data)));
    return await firstValueFrom(settings);
  }
}
