import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from './local-storage.service';
import { KEY_LOCALSTORAGE } from '@monorepo-bb-app/shared';


@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  constructor(
    private translate: TranslateService,
    private _localStorageService: LocalStorageService
  ) {
    this.translate.addLangs(['es', 'en']);
  }

  public async setDefaultConfig() {
    const lang = await this._localStorageService.get(KEY_LOCALSTORAGE.LANG);
    const currentLanguage = lang ?? 'es';
    this.translate.setDefaultLang(currentLanguage);
    this.translate.use(currentLanguage);
  }

  public async changeLanguage(language: string) {
    this.translate.use(language);
    await this._localStorageService.set(KEY_LOCALSTORAGE.LANG, language);
  }
}
