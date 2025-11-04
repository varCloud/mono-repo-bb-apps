import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
//este es el que usa el login
export class TabMenuService {
  private _showMenu = signal<boolean>(false);

  constructor() {}

  public getShowMenu() {
    return this._showMenu();
  }

  private setShowMenu(state: boolean) {
    this._showMenu.set(state);
  }

  public showMenu() {
    this.setShowMenu(true);
  }

  public hideLoader() {
    this.setShowMenu(false);
  }
}
