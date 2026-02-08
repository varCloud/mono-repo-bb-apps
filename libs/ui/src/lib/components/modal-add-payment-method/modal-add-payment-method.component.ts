import { arrowBackOutline , chevronBackOutline } from 'ionicons/icons';
import { Component, input, Input, type OnInit } from '@angular/core';
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
  IonBackButton,
  IonImg
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { MODAL_RESPONSE } from 'libs/shared/constants/enums';
import { addIcons } from 'ionicons';
import { CONSTANTS } from '@monorepo-bb-app/shared';

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
    IonBackButton,
    IonImg
  ],
  templateUrl: './modal-add-payment-method.component.html',
  styleUrl: './modal-add-payment-method.component.scss',
})
export class ModalAddPaymentMethodComponent implements OnInit {
  @Input() idCustomer = '';
  public title = input<string>('');
  public logo = input<string>(CONSTANTS.DEFAULT_LOGO_LETRAS_TOOLBAR);
  constructor(private modalCtrl: ModalController) {
     addIcons({ arrowBackOutline, chevronBackOutline });
  }
  ngOnInit(): void {}

  cancel() {
    this.modalCtrl.dismiss(null, MODAL_RESPONSE.CANCEL);
  }

  succesAddPayment(event: { data: any }) {
    this.modalCtrl.dismiss(event.data, MODAL_RESPONSE.CONFIRM);
  }
}
