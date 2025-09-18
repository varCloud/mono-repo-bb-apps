import { Injectable, signal } from '@angular/core';

import { LocalStorageService } from './local-storage.service';
import { User,KEY_LOCALSTORAGE } from '@monorepo-bb-app/shared';



@Injectable({
  providedIn: 'root',
})
export class SesionService {
  private user = signal<User | null>(null);
  public user$ = this.user.asReadonly();

  constructor(private _localStorage: LocalStorageService) {
    this.getUserFromLocalStorage();
  }

  setUser(user: User | null) {
    this.user.set(user);
    if (user) {
      this._localStorage.set(KEY_LOCALSTORAGE.USER, user);
    }
  }

  clearSesion() {
    this.user.set(null);
    this._localStorage.clear();
  }

  async getUserFromLocalStorage(): Promise<User | null> {
    const user = await this._localStorage.get(KEY_LOCALSTORAGE.USER);
    if (user) {
      this.setUser(user);
    }
    return user;
  }
}
