import { Component } from '@angular/core';
import { ModalController, IonIcon, IonButton } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { idCardOutline, closeCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'lib-stripe-identification-warning-modal',
  templateUrl: './stripe-identification-warning-modal.component.html',
  styleUrls: ['./stripe-identification-warning-modal.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, TranslateModule],
})
export class StripeIdentificationWarningModalComponent {
  constructor(private modalCtrl: ModalController) {
    addIcons({ idCardOutline, closeCircleOutline });
  }

  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  confirmContinue() {
    this.modalCtrl.dismiss({ continue: true }, 'confirm');
  }
}
