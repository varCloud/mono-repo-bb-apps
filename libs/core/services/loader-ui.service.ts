import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
//este es el que usa el login
export class LoaderUIService {
  private isLoading = signal<boolean>(false);

  constructor() {}

  public getLoading() {
    return this.isLoading();
  }

  private setLoading(state: boolean) {
    this.isLoading.set(state);
  }

  public showLoader() {
    this.setLoading(true);
  }

  public hideLoader() {
    this.setLoading(false);
  }
}
