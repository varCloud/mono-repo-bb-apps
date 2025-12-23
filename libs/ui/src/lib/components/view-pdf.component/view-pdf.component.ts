import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { addIcons } from 'ionicons';
import {
  addOutline,
  removeOutline,
  expandOutline,
  contractOutline,
} from 'ionicons/icons';
import { CONSTANTS } from '@monorepo-bb-app/shared';
import { IonIcon, IonSpinner } from '@ionic/angular/standalone';

@Component({
  selector: 'lib-view-pdf',
  standalone: true,
  imports: [CommonModule, PdfViewerModule, IonIcon, IonSpinner],
  templateUrl: './view-pdf.component.html',
  styleUrl: './view-pdf.component.scss',
})
export class ViewPdfComponent {
  url = input.required<string>();

  readonly zoom = signal(CONSTANTS.ZOOM_CONFIG.DEFAULT);
  readonly isFullscreen = signal(false);
  readonly isLoading = signal(true);
  readonly hasError = signal(false);

  constructor() {
    this.registerIcons();
  }

  private registerIcons(): void {
    addIcons({
      addOutline,
      removeOutline,
      expandOutline,
      contractOutline,
    });
  }

  zoomIn(): void {
    const newZoom = Math.min(
      this.zoom() + CONSTANTS.ZOOM_CONFIG.STEP,
      CONSTANTS.ZOOM_CONFIG.MAX
    );
    this.zoom.set(newZoom);
  }

  zoomOut(): void {
    const newZoom = Math.max(
      this.zoom() - CONSTANTS.ZOOM_CONFIG.STEP,
      CONSTANTS.ZOOM_CONFIG.MIN
    );
    this.zoom.set(newZoom);
  }

  resetZoom(): void {
    this.zoom.set(CONSTANTS.ZOOM_CONFIG.DEFAULT);
  }

  get canZoomIn(): boolean {
    return this.zoom() < CONSTANTS.ZOOM_CONFIG.MAX;
  }

  get canZoomOut(): boolean {
    return this.zoom() > CONSTANTS.ZOOM_CONFIG.MIN;
  }

  get zoomPercentage(): number {
    return Math.round(this.zoom() * 100);
  }

  toggleFullscreen(): void {
    if (!this.isFullscreen()) {
      this.enterFullscreen();
    } else {
      this.exitFullscreen();
    }
  }

  private enterFullscreen(): void {
    this.isFullscreen.set(true);
    document.body.style.overflow = 'hidden';
  }

  private exitFullscreen(): void {
    this.isFullscreen.set(false);
    document.body.style.overflow = '';
  }

  onPdfLoaded(): void {
    this.isLoading.set(false);
    this.hasError.set(false);
  }

  onPdfError(): void {
    this.isLoading.set(false);
    this.hasError.set(true);
  }

  onPdfLoadingStart(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
  }
}
