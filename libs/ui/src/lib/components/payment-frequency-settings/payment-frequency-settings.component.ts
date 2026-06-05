import {
  Component,
  computed,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CatalogsService, CatalogType , ToastService,  } from '@monorepo-bb-app/shared';
import { ListSkeletonComponent } from '../skeleton/list-skeleton/list-skeleton.component';


import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

import {
  IonCol,
  IonGrid,
  IonRow,
  IonText,
  IonLabel,
  IonItem,
  IonList,
  IonListHeader,
  IonRadio,
  IonRadioGroup,
  IonNote,
  IonRange,
  RangeCustomEvent,
  IonInput,
  IonContent,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDownOutline } from 'ionicons/icons';
import { debounceTime, finalize } from 'rxjs';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CurrencyComponent } from '../currency/currency.component';
import { LocalStorageService } from '@monorepo-bb-app/core';
import { KEY_LOCALSTORAGE } from '@monorepo-bb-app/shared';
import { ErrorsMessagesService } from '@monorepo-bb-app/shared';
import { Config } from '@monorepo-bb-app/shared';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { PaymentFrecuency, PaymentFrecuencyModel } from '@monorepo-bb-app/shared';

@Component({
  selector: 'app-payment-frequency-settings',
  templateUrl: './payment-frequency-settings.component.html',
  styleUrls: ['./payment-frequency-settings.component.scss'],
  imports: [
    IonInput,
    IonRange,
    IonNote,
    IonRadioGroup,
    IonItem,
    IonList,
    IonListHeader,
    IonLabel,
    IonCol,
    IonGrid,
    IonRow,
    IonText,
    IonIcon,
    ListSkeletonComponent,
    IonRadio,
    FormsModule,
    CommonModule,
    TranslateModule,
    CurrencyComponent,
    ReactiveFormsModule,
    ErrorMessageComponent,
  ],
  providers: [TranslatePipe],
})
export class PaymentFrequencySettingsComponent implements OnInit {
  PaymentFrecuencySelected = output<PaymentFrecuency[]>();
  PaymentFrecuencyFree = output<PaymentFrecuency>();
  defaultValues = input<PaymentFrecuency[]>([]);
  isLoading = signal<boolean>(false);
  paymentFrecuency = signal<PaymentFrecuency[]>([]);
  selectedPaymentFrequencyId = signal<number | null>(null);
  currencyControl = new FormControl<number | null>(null);
  currency = signal<string | null>('');
  config = signal<Config | null>(null);
  showBreakdown = signal<boolean>(true);

  selectedPaymentFrequency = computed(() => {
    if (this.selectedPaymentFrequencyId() === null) {
      return new PaymentFrecuencyModel({});
    }
    return this.paymentFrecuency().find(
      (item) => item.cycleId === this.selectedPaymentFrequencyId(),
    )!;
  });

  commissionBreakdown = computed(() => {
    const frequency = this.selectedPaymentFrequency();
    const cfg = this.config();

    if (!frequency?.amount || !cfg) {
      return { amount: 0, appCommission: 0, stripePercentage: 0, stripeFixedFee: 0, net: 0, percentApp: 0, percentStripe: 0 };
    }

    const amount = frequency.amount;
    const appCommission = (amount * cfg.percentBodyBooster) / 100;
    const stripePercentage = (amount * cfg.percentTransactionStripe) / 100;
    const stripeFixedFee = cfg.amountTransactionStripe;
    const net = Math.max(0, amount - appCommission - stripePercentage - stripeFixedFee);

    return {
      amount,
      appCommission,
      stripePercentage,
      stripeFixedFee,
      net,
      percentApp: cfg.percentBodyBooster,
      percentStripe: cfg.percentTransactionStripe,
    };
  });

  calculatePayment = computed(() => this.commissionBreakdown().net);

  constructor(
    private _paymentFrequencyService: CatalogsService,
    private _toastService: ToastService,
    private _translate: TranslatePipe,
    private _localStorage: LocalStorageService,
    private _errorsMessagesService: ErrorsMessagesService,
  ) {
    addIcons({ chevronDownOutline });
  }

  toggleBreakdown() {
    this.showBreakdown.update((v) => !v);
  }

  ngOnInit() {
    this.isLoading.set(true);
    this._paymentFrequencyService
      .getCatalog(CatalogType.BILLING_CYCLES)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data: any) => {
          const payments = data.filter((item: any) => item.isTrialSubscription != 1).map(
            (item: any) => new PaymentFrecuencyModel(item),
          );
          payments.sort(
            (a: PaymentFrecuencyModel, b: PaymentFrecuencyModel) =>
              a.interval - b.interval,
          );
          this.setFreeFrequency(data)
          payments[0].isRecommended = true;
          if (this.defaultValues()?.length > 0) {
            payments.forEach((payment: any) => {
              const defaultPayment = this.defaultValues().find(
                (item) => item.cycleId === payment.cycleId,
              );
              if (defaultPayment) {
                payment.amount = defaultPayment.amount;
              }
            });
          }
          this.selectPaymentFrequency(payments[0]);
          this.paymentFrecuency.set(payments);
          this.setValidators();
        },
        error: () => {
          this._toastService.error(
            this._translate.transform('error.error-processing'),
          );
        },
      });
    this.subscribeToCurrencyControl();
    this._setCurrency();
  }

  public selectPaymentFrequency(payment: PaymentFrecuency) {
    this.selectedPaymentFrequencyId.set(payment.cycleId);
    this.setValidators();
  }

  public onIonChange(event: RangeCustomEvent) {
    if (!this.selectedPaymentFrequency()) {
      return;
    }
    this.paymentFrecuency.update((current) => {
      return current.map((item) => {
        if (item.cycleId === this.selectedPaymentFrequency().cycleId) {
          const amount = event.detail.value as number;
          item.amount = amount;
          this.currencyControl.setValue(amount);
        }
        return item;
      });
    });
    this.PaymentFrecuencySelected.emit(this.paymentFrecuency());
  }

  public setValidators() {
    this.currencyControl.setValidators([
      Validators.required,
      Validators.min(this.selectedPaymentFrequency()?.amountMin),
      Validators.max(this.selectedPaymentFrequency()?.amountMax),
    ]);
    this.currencyControl.setValue(this.selectedPaymentFrequency()?.amount);
    this.currencyControl.updateValueAndValidity();
  }

  private subscribeToCurrencyControl() {
    this.currencyControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => {
        const amount = value as number;
        if (this.selectedPaymentFrequency) {
          if (amount > this.selectedPaymentFrequency().amountMax) {
            return;
          }
          if (amount < this.selectedPaymentFrequency().amountMin) {
            return;
          }
          this.paymentFrecuency.update((current) => {
            return current.map((item) => {
              if (item.cycleId === this.selectedPaymentFrequency().cycleId) {
                item.amount = amount;
              }
              return item;
            });
          });
          this.PaymentFrecuencySelected.emit(this.paymentFrecuency());
        }
      });
  }

  private async _setCurrency() {
    const config = await this._localStorage.get(KEY_LOCALSTORAGE.CONFIG);
    this.config.set(config);
    this.currency.set(config?.currency || 'MXN');
  }

  private setFreeFrequency(data:any) {
    const freeFrequency = data.find(
      (item:any) => item.isTrialSubscription === 1,
    );
    
    if(!freeFrequency) return;

    this.PaymentFrecuencyFree.emit(new PaymentFrecuencyModel(freeFrequency)!);
  }
}
