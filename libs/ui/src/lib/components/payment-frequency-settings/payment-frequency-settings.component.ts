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
  IonRadio,
  IonRadioGroup,
  IonNote,
  IonRange,
  RangeCustomEvent,
  IonInput,
  IonContent,
} from '@ionic/angular/standalone';
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
    IonLabel,
    IonCol,
    IonGrid,
    IonRow,
    IonText,
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
  defaultValues = input<PaymentFrecuency[]>([]);
  isLoading = signal<boolean>(false);
  paymentFrecuency = signal<PaymentFrecuency[]>([]);
  selectedPaymentFrequencyId = signal<number | null>(null);
  currencyControl = new FormControl<number | null>(null);
  currency = signal<string | null>('');
  config = signal<Config | null>(null);
  selectedPaymentFrequency = computed(() => {
    if (this.selectedPaymentFrequencyId() === null) {
      return new PaymentFrecuencyModel({});
    }
    return this.paymentFrecuency().find(
      (item) => item.cycleId === this.selectedPaymentFrequencyId(),
    )!;
  });

  calculatePayment = computed(() => {
    this.paymentFrecuency();
    const frequency = this.selectedPaymentFrequency();
    const cfg = this.config();

    if (!frequency?.amount || !cfg) return 0;

    const amount = frequency.amount;
    const appCommission = (amount * cfg.percentBodyBooster) / 100;
    const stripePercentage = (amount * cfg.percentTransactionStripe) / 100;
    const stripeFixedFee = cfg.amountTransactionStripe;
    const result = amount - appCommission - stripePercentage - stripeFixedFee;

    return Math.max(0, result);
  });

  constructor(
    private _paymentFrequencyService: CatalogsService,
    private _toastService: ToastService,
    private _translate: TranslatePipe,
    private _localStorage: LocalStorageService,
    private _errorsMessagesService: ErrorsMessagesService,
  ) {}

  ngOnInit() {
    this.isLoading.set(true);
    this._paymentFrequencyService
      .getCatalog(CatalogType.BILLING_CYCLES)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data: any) => {
          const payments = data.map(
            (item: any) => new PaymentFrecuencyModel(item),
          );
          payments.sort(
            (a: PaymentFrecuencyModel, b: PaymentFrecuencyModel) =>
              a.interval - b.interval,
          );
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

  public selectPaymentFrequency(payment: PaymentFrecuencyModel) {
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
}
