import { Component, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { wifiOutline, cloudOfflineOutline, wifi } from 'ionicons/icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-no-connection-modal',
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon, TranslateModule],
  templateUrl: './no-connection-modal.component.html',
  styleUrls: ['./no-connection-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoConnectionModalComponent {
  retry = output<void>();

  constructor() {
    addIcons({ wifiOutline, cloudOfflineOutline, wifi });
  }

  onRetry(): void {
    this.retry.emit();
  }
}
