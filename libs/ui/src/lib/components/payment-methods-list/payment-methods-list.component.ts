import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  type OnInit,
} from '@angular/core';
import {
  IonButton,
  IonRow,
  IonGrid,
  IonCol,
  IonRadioGroup,
  IonItem,
  IonIcon,
  IonLabel,
  IonBadge,
  IonRadio,
  ModalController,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { StripeService } from '../../../../../shared/services/stripe/stripe.service';
import { LoaderUIService } from '../../../../../core/services/loader-ui.service';
import { ModalAddPaymentMethodComponent } from '../modal-add-payment-method/modal-add-payment-method.component';
import { MODAL_RESPONSE } from '../../../../../shared/constants/enums';
import { finalize } from 'rxjs';
import { PaymentMethod } from '../../../../../shared/models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'lib-payment-methods-list',
  imports: [
    IonRadio,
    IonBadge,
    IonLabel,
    IonIcon,
    IonItem,
    IonRadioGroup,
    IonCol,
    IonGrid,
    IonRow,
    IonButton,
    TranslateModule,
    FormsModule,
    NgClass,
    TitleCasePipe,
  ],
  templateUrl: './payment-methods-list.component.html',
  styleUrl: './payment-methods-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMethodsListComponent implements OnInit {
  userId = input.required<number>();
  selectPaymentMethodId = input<string | null>(null);
  paymentMethods = signal<any[]>([]);
  selectedPaymentMethod = signal<string | null>(null);
  selectedPaymentMethodEvent = output<PaymentMethod>();

  constructor(
    private modalCtrl: ModalController,
    private stripeService: StripeService,
    private _loader: LoaderUIService
  ) {}

  ngOnInit(): void {
    this.loadPaymentMethods(this.selectPaymentMethodId() || null);
  }

  public selectPaymentMethod(method: any) {
    this.selectedPaymentMethod.set(method.id);
    this.selectedPaymentMethodEvent.emit(method);
  }

  public async openModalAddPaymentMethod() {
    const modal = await this.modalCtrl.create({
      component: ModalAddPaymentMethodComponent,
      componentProps: {
        idCustomer: this.userId(),
      },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === MODAL_RESPONSE.CONFIRM) {
      this.loadPaymentMethods(data?.payment_method);
    }
  }

  public async loadPaymentMethods(idPaymentMethod: string | null = null) {
    const customerId = this.userId();
    this._loader.showLoader();
    this.stripeService
      .getPaymentMethods(customerId)
      .pipe(finalize(() => this._loader.hideLoader()))
      .subscribe({
        next: (resp: any) => {
          this.paymentMethods.set(resp.data);
          if (idPaymentMethod) {
            const findPaymentMethod = resp.data.find(
              (pm: any) => pm.id === idPaymentMethod
            );
            if (findPaymentMethod) {
              this.selectPaymentMethod(findPaymentMethod);
            }
          }
        },
        error: (error) => {
          console.error('Error loading payment methods:', error);
        },
      });
  }
}
