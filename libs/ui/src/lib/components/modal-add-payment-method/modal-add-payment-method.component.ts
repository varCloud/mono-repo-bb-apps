import { Component, Input, type OnInit } from '@angular/core';
import { AddPaymentMethodComponent } from '../stripe/add-payment-method/add-payment-method.component';
import {
  ModalController,
  IonButtons,
  IonInput,
  IonModal,
  IonGrid,
  IonButton,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { MODAL_RESPONSE } from 'libs/shared/constants/enums';

@Component({
  selector: 'lib-modal-add-payment-method',
  imports: [
    IonTitle,
    IonToolbar,
    IonHeader,
    IonContent,
    IonButton,
    TranslateModule,
    IonButtons,
    AddPaymentMethodComponent,
  ],
  templateUrl: './modal-add-payment-method.component.html',
  styleUrl: './modal-add-payment-method.component.scss',
})
export class ModalAddPaymentMethodComponent implements OnInit {
  @Input() idCustomer = '';
  constructor(private modalCtrl: ModalController) {}
  ngOnInit(): void {}

  cancel() {
    this.modalCtrl.dismiss(null, MODAL_RESPONSE.CANCEL);
  }

  succesAddPayment(event: { data: any }) {
    this.modalCtrl.dismiss(event.data, MODAL_RESPONSE.CONFIRM);
  }
}
