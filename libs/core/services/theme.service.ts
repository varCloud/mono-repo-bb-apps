import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { KEY_LOCALSTORAGE } from '@monorepo-bb-app/shared';


@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  public isDarkMode = false;
  public currentTheme: 'light' | 'dark' = 'light';
  constructor(private _localStorageService: LocalStorageService) {}

  public async initializeTheme() {
    const savedTheme = await this._localStorageService.get(KEY_LOCALSTORAGE.THEME);
    const prefersTheme = window.matchMedia(`(prefers-color-scheme: ${savedTheme})`);
    const isDarkMode = prefersTheme.matches;
    this.isDarkMode = isDarkMode;
    this.currentTheme = savedTheme;
    this.toggleDarkPalette(isDarkMode);
  }

  public setTheme(themeName: 'light' | 'dark'): void {
    const isDarkMode = themeName === 'dark';
    this.toggleDarkPalette(isDarkMode);
    this.isDarkMode = isDarkMode;
    this.currentTheme = themeName;
    this._localStorageService.set(KEY_LOCALSTORAGE.THEME, themeName);
  }

  private toggleDarkPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }
}
