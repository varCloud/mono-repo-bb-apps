import { Injectable } from '@angular/core';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { AppSettingsService } from './app-settings.service';

export type AppUserType = 'athlete' | 'creator';

@Injectable({
  providedIn: 'root',
})
export class AppVersionService {
  constructor(private _appSettingsService: AppSettingsService) {}

  /**
   * Compara la versión instalada (nativa) con la publicada en tiendas
   * (expuesta en app-settings). Devuelve la URL de la tienda correspondiente
   * a la plataforma actual si existe una versión más reciente; de lo contrario
   * devuelve `null`. En web siempre devuelve `null`.
   */
  async getRequiredUpdate(userType: AppUserType): Promise<string | null> {
    if (!Capacitor.isNativePlatform()) {
      return null;
    }

    const settings = this._appSettingsService.settings$();
    if (!settings) {
      return null;
    }

    const isAthlete = userType === 'athlete';
    const isIos = Capacitor.getPlatform() === 'ios';

    const storeVersion = isAthlete
      ? isIos
        ? settings.athleteAppStoreVersion
        : settings.athletePlayStoreVersion
      : isIos
        ? settings.coachAppStoreVersion
        : settings.coachPlayStoreVersion;

    const storeUrl = isAthlete
      ? isIos
        ? settings.athleteLinkAppStore
        : settings.athleteLinkPlayStore
      : isIos
        ? settings.coachLinkAppStore
        : settings.coachLinkPlayStore;

    if (!storeVersion || !storeUrl) {
      return null;
    }

    const { version } = await App.getInfo();
    return this._isNewer(storeVersion, version) ? storeUrl : null;
  }

  /** `true` si `store` representa una versión mayor que `current` (semver numérico). */
  private _isNewer(store: string, current: string): boolean {
    const storeParts = store.split('.').map((n) => parseInt(n, 10) || 0);
    const currentParts = current.split('.').map((n) => parseInt(n, 10) || 0);
    const length = Math.max(storeParts.length, currentParts.length);

    for (let i = 0; i < length; i++) {
      const s = storeParts[i] ?? 0;
      const c = currentParts[i] ?? 0;
      if (s > c) return true;
      if (s < c) return false;
    }
    return false;
  }
}
