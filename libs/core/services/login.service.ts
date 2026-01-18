import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { firstValueFrom, map, Observable, tap } from 'rxjs';
import { environment } from '../../shared/environment/environment';
import { API_URLS } from '../../shared/constants/api-urls';
import { LocalStorageService } from './local-storage.service';
import { SesionService } from './sesion.service';
import { UserService } from './user.service';
import { LoginCredentials, UserResponse } from '../../shared/models/auth.model';
import { KEY_LOCALSTORAGE } from '../../shared/constants/key-localstorage';
import { AppSettingsModel } from '../../shared/models/app-settings';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private _baseUrl = environment.API_URL + API_URLS.LOGIN;

  constructor(
    private _http: HttpClient,
    private _localStorage: LocalStorageService,
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
