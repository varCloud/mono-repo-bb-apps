import { ToastService } from './../../../../../shared/services/toast.service';
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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StripeService } from '../../../../../shared/services/stripe/stripe.service';
import { LoaderUIService } from '../../../../../core/services/loader-ui.service';
import { ModalAddPaymentMethodComponent } from '../modal-add-payment-method/modal-add-payment-method.component';
import { OptionsPaymentMethodModalComponent } from '../options-payment-method-modal/options-payment-method-modal.component';
import { MODAL_RESPONSE } from '../../../../../shared/constants/enums';
import { finalize } from 'rxjs';
import { PaymentMethod } from '../../../../../shared/models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass, TitleCasePipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { ellipsisVertical } from 'ionicons/icons';

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
  stripeAccountId = input<string>('');
  selectPaymentMethodId = input<string | null>(null);
  showMenuOptions = input<boolean>(false);
  paymentMethods = signal<any[]>([]);
  selectedPaymentMethod = signal<string | null>(null);
  selectedPaymentMethodEvent = output<PaymentMethod>();

  constructor(
    private modalCtrl: ModalController,
    private stripeService: StripeService,
    private _loader: LoaderUIService,
    private _toastService: ToastService,
    private _translateService: TranslateService
  ) {
    addIcons({ ellipsisVertical });
  }

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

  public async openOptionsModal(method: PaymentMethod, event: Event) {
    event.stopPropagation();
    const modal = await this.modalCtrl.create({
      component: OptionsPaymentMethodModalComponent,
      componentProps: {
        paymentMethod: method,
      },
      breakpoints: [0, 0.3, 0.5],
      initialBreakpoint: 0.3,
      handle: false,
      cssClass: 'bottom-sheet-modal-rounded',
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === MODAL_RESPONSE.CONFIRM && data) {
      if (data.setAsDefault) {
        this.setPaymentMethodAsDefault(method);
      } else if (data.deletePaymentMethod) {
        this.deletePaymentMethod(method);
      }
    }
  }

  private setPaymentMethodAsDefault(method: PaymentMethod) {
    this._loader.showLoader();
    this.stripeService
      .setDefaultPaymentMethod(this.stripeAccountId(), method.id)
      .pipe(finalize(() => this._loader.hideLoader()))
      .subscribe({
        next: () => {
          this.loadPaymentMethods(method.id);
          this._toastService.success(this._translateService.instant('payment-methods.default-set-success'));
        },
        error: (error: any) => {
          console.error('Error setting default payment method:', error);
        },
      });
  }

  private deletePaymentMethod(method: PaymentMethod) {
    this._loader.showLoader();
    this.stripeService
      .deletePaymentMethod(method.id)
      .pipe(finalize(() => this._loader.hideLoader()))
      .subscribe({
        next: () => {
          this.loadPaymentMethods();
          this._toastService.success(this._translateService.instant('payment-methods.deleted-success'));
        },
        error: (error: any) => {
          console.error('Error deleting payment method:', error);
        },
      });
  }
}
