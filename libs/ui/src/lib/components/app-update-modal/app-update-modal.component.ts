import { Component, Input } from '@angular/core';
import { IonIcon, IonButton } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { Browser } from '@capacitor/browser';
import { addIcons } from 'ionicons';
import { rocketOutline } from 'ionicons/icons';

interface ConfettiPiece {
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotate: number;
}

@Component({
  selector: 'lib-app-update-modal',
  templateUrl: './app-update-modal.component.html',
  styleUrls: ['./app-update-modal.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, TranslateModule],
})
export class AppUpdateModalComponent {
  /** URL de la tienda (App Store / Play Store) a la que se enviará al usuario. */
  @Input() storeUrl = '';

  /** Piezas de confeti generadas con propiedades aleatorias (efecto CSS puro). */
  public readonly confetti: ConfettiPiece[] = this._buildConfetti(40);

  constructor() {
    addIcons({ rocketOutline });
  }

  async openStore() {
    if (!this.storeUrl) {
      return;
    }
    await Browser.open({ url: this.storeUrl });
  }

  private _buildConfetti(count: number): ConfettiPiece[] {
    const colors = ['#FFC700', '#FF3D71', '#0095FF', '#00D68F', '#A16EFF', '#FF8A00'];
    return Array.from({ length: count }, () => ({
      left: this._random(0, 100),
      delay: this._random(0, 30) / 10,
      duration: this._random(25, 45) / 10,
      color: colors[Math.floor(this._random(0, colors.length))],
      size: this._random(6, 12),
      rotate: this._random(0, 360),
    }));
  }

  private _random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}
