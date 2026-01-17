import { Component, input, signal } from '@angular/core';
import { ModalController, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, trashOutline } from 'ionicons/icons';
import { PaymentMethod } from '../../../../../shared/models/user.model';

@Component({
  selector: 'lib-options-payment-method-modal',
  templateUrl: './options-payment-method-modal.component.html',
  styleUrls: ['./options-payment-method-modal.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton],
})
export class OptionsPaymentMethodModalComponent {
  paymentMethod = input.required<PaymentMethod>();
  viewState = signal<'options' | 'confirm'>('options');

  constructor(private modalCtrl: ModalController) {
    addIcons({ checkmarkCircleOutline, trashOutline });
  }

  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  showConfirmView() {
    this.viewState.set('confirm');
  }

  showOptionsView() {
    this.viewState.set('options');
  }

  setAsDefault() {
    this.modalCtrl.dismiss({ setAsDefault: true }, 'confirm');
  }

  confirmDelete() {
    this.modalCtrl.dismiss({ deletePaymentMethod: true }, 'confirm');
  }
}
