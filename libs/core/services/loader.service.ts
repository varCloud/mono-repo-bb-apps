import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loadingCount = signal(0);
  readonly isLoading = computed(() => this.loadingCount() > 0);

  constructor() {}

  showSpinner(): void {
    this.loadingCount.update((count) => count + 1); 
  }

  hideSpinner(): void {
    this.loadingCount.update((count) => Math.max(0, count - 1));
  }

  forceHide(): void {
    this.loadingCount.set(0);
  }
}
