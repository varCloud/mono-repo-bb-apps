import { Component, signal, type OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import {
  IonGrid,
  IonContent,
  IonRow,
  IonCol,
  IonButton,
  ModalController,
  IonCheckbox,
  IonItem,
  IonLabel,
  IonIcon,
  IonBadge,
  IonRadio,
  IonRadioGroup,
} from '@ionic/angular/standalone';
import { LoaderUIService, SesionService } from '@monorepo-bb-app/core';
import { StripeService } from '@monorepo-bb-app/shared';
import {
  AddPaymentMethodComponent,
  LayoutContentComponent,
  ModalAddPaymentMethodComponent,
} from '@monorepo-bb-app/ui';
import { TranslateModule } from '@ngx-translate/core';
import { MODAL_RESPONSE } from 'libs/shared/constants/enums';
import { finalize } from 'rxjs';
import { addIcons } from 'ionicons';
import { cardOutline } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-methods-page',
  imports: [
    IonRadioGroup,
    IonRadio,
    IonCheckbox,
    IonCol,
    IonRow,
    IonContent,
    IonGrid,
    LayoutContentComponent,
    TranslateModule,
    IonButton,
    IonItem,
    IonLabel,
    IonIcon,
    IonBadge,
    TitleCasePipe,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './payment-methods-page.component.html',
  styleUrl: './payment-methods-page.component.scss',
})
export class PaymentMethodsPageComponent implements OnInit {
  paymentMethods = signal<any[]>([]);
  selectedPaymentMethod = signal<string | null>(null);

  constructor(
    public _sesisonService: SesionService,
    private modalCtrl: ModalController,
    private stripeService: StripeService,
    private _loader: LoaderUIService
  ) {
    addIcons({ cardOutline });
  }

  ngOnInit(): void {
    this.loadPaymentMethods();
  }

  public selectPaymentMethod(methodId: string) {
    this.selectedPaymentMethod.set(methodId);
  }

  public getBrandIcon(brand: string): string {
    const brandIcons: { [key: string]: string } = {
      visa: 'card-outline',
      mastercard: 'card-outline',
      amex: 'card-outline',
      discover: 'card-outline',
      diners: 'card-outline',
      jcb: 'card-outline',
      unionpay: 'card-outline',
      default: 'card-outline',
    };
    return brandIcons[brand?.toLowerCase()] || brandIcons['default'];
  }

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
      this.loadPaymentMethods();
    }
  }

  public async loadPaymentMethods() {
    const customerId = this._sesisonService.user$().userId;
    this._loader.showLoader();
    this.stripeService
      .getPaymentMethods(customerId)
      .pipe(finalize(() => this._loader.hideLoader()))
      .subscribe({
        next: (resp: any) => {
          this.paymentMethods.set(resp.data);
        },
        error: (error) => {
          console.error('Error loading payment methods:', error);
        },
      });
  }
}
