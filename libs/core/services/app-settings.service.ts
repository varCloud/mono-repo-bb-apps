import { Injectable, signal } from '@angular/core';
import { AppSettingsModel } from '@monorepo-bb-app/shared';
import { LocalStorageService } from './local-storage.service';
import { KEY_LOCALSTORAGE } from '../../shared/constants/key-localstorage';

@Injectable({
  providedIn: 'root',
})
export class AppSettingsService {
  private _settings = signal<AppSettingsModel | null>(null);
  public settings$ = this._settings.asReadonly();

  constructor(private _localStorage: LocalStorageService) {
    this._loadFromStorage();
  }

  private async _loadFromStorage() {
    const config = await this._localStorage.get(KEY_LOCALSTORAGE.CONFIG);
    if (config) {
      this._settings.set(config);
    }
  }

  async setSettings(settings: AppSettingsModel) {
    this._settings.set(settings);
    await this._localStorage.set(KEY_LOCALSTORAGE.CONFIG, {
      ...settings,
      currency: settings.paymentCurrency,
    });
  }

  clearSettings() {
    this._settings.set(null);
  }
}
