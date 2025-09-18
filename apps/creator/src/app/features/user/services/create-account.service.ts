import { Injectable, signal } from '@angular/core';
import {  environment} from '@monorepo-bb-app/shared';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from '@monorepo-bb-app/shared';
import { UserCreateAccountPayload } from '../models/user.interfaces';

@Injectable({
  providedIn: 'root',
})
export class CreateAccountService {
  private _baseUrl = environment.API_URL;
  private _user = signal<UserCreateAccountPayload | null>(null);

  constructor(private _http: HttpClient) {}

  public setUser(user: UserCreateAccountPayload): void {
    this._user.set(user);
  }

  public clearUser(): void {
    this._user.set(null);
  }

  public getUser(): UserCreateAccountPayload | null {
    return this._user();
  }

  public createAccount(user: UserCreateAccountPayload) {
    if (!this._user()) {
      throw new Error('User data is not set');
    }

    return this._http.post(`${this._baseUrl}${API_URLS.USER}`, user);
  }
}
