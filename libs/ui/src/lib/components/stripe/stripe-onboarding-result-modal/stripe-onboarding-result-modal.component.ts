import { Component, Input } from '@angular/core';
import { ModalController, IonIcon, IonButton } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, alertCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'lib-stripe-onboarding-result-modal',
  templateUrl: './stripe-onboarding-result-modal.component.html',
  styleUrls: ['./stripe-onboarding-result-modal.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, TranslateModule],
})
export class StripeOnboardingResultModalComponent {
  @Input() isSuccess = true;

  constructor(private modalCtrl: ModalController) {
    addIcons({ checkmarkCircleOutline, alertCircleOutline });
  }

  closeModal() {
    this.modalCtrl.dismiss(null, 'confirm');
  }
}
