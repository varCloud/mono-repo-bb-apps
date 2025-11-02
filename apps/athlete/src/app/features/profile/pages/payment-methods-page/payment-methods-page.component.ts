import { Component, type OnInit } from '@angular/core';
import {
  IonGrid,
  IonContent,
  IonRow,
  IonCol,
  IonButton,
  ModalController,
} from '@ionic/angular/standalone';
import { SesionService } from '@monorepo-bb-app/core';
import {
  AddPaymentMethodComponent,
  LayoutContentComponent,
  ModalAddPaymentMethodComponent,
} from '@monorepo-bb-app/ui';
import { TranslateModule } from '@ngx-translate/core';
import { MODAL_RESPONSE } from 'libs/shared/constants/enums';

@Component({
  selector: 'app-payment-methods-page',
  imports: [
    IonCol,
    IonRow,
    IonContent,
    IonGrid,
    LayoutContentComponent,
    TranslateModule,
    IonButton,
  ],
  templateUrl: './payment-methods-page.component.html',
  styleUrl: './payment-methods-page.component.scss',
})
export class PaymentMethodsPageComponent implements OnInit {
  constructor(
    public _sesisonService: SesionService,
    private modalCtrl: ModalController
  ) {}
  ngOnInit(): void {}

  public async openModalAddPaymentMethod() {
    const modal = await this.modalCtrl.create({
      component: ModalAddPaymentMethodComponent,
      componentProps: {
        idCustomer: this._sesisonService.user$().userId,
      },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === MODAL_RESPONSE.CONFIRM) {
    }
  }
}
