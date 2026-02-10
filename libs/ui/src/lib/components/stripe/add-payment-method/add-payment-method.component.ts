import { Component, ElementRef, input, OnInit, output, signal, viewChild } from '@angular/core';

import {
  IonButton,
  IonSpinner,
  IonCol,
  IonGrid,
  IonRow,
  IonContent,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { StripeService, ToastService } from '@monorepo-bb-app/shared';
import { LoaderUIService } from '@monorepo-bb-app/core';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-add-payment-method',
  templateUrl: './add-payment-method.component.html',
  styleUrls: ['./add-payment-method.component.scss'],
  imports: [
    IonSpinner,
    IonButton,
    TranslateModule,
    ReactiveFormsModule,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
  ],
  providers: [TranslatePipe],
})
export class AddPaymentMethodComponent implements OnInit {
  customerId = input.required<string>();
  succesAddPayment = output<{ data: any }>();

  isLoading = signal<boolean>(false);
  paymentMethodElement = viewChild<ElementRef>('paymentMethod');
  formPaymentMethod: ReturnType<FormBuilder['group']>;
  elements: any;
  card: any;
  constructor(
    private _stripeService: StripeService,
    private _fb: FormBuilder,
    private _translate: TranslatePipe,
    private _loader: LoaderUIService,
    private _toastService: ToastService
  ) {
    this.formPaymentMethod = this._fb.group({});
  }

  ngOnInit() {
    this.addCard();
  }

  async addCard() {
    const appearance = {
      theme: 'flat',
      variables: { colorPrimaryText: '#f79145' },
    };

    const paymentElementOptions = {
      layout: {
        type: 'tabs',
        defaultCollapsed: false,
        radios: false,
        spacedAccordionItems: false,
      },
      wallets: {
        link: 'never',
      },
    };
    const options = {
      fields: {
        billingDetails: {
          name: 'never',
          email: 'never',
          phone: 'never',
          address: {
            line1: 'never',
            line2: 'never',
            city: 'never',
            state: 'never',
            postalCode: 'never',
            country: 'never',
          },
        },
      },
      terms: {
        card: 'never',
      },
    };
    this._loader.showLoader();
    this.isLoading.set(true);
    this._stripeService
      .getSetupIntents(this.customerId())
      .pipe(
        finalize(() => {
          this._loader.hideLoader();
          this.isLoading.set(false);
        })
      )
      .subscribe(
        (resp: any) => {
          const { client_secret } = resp.data as any;
          this.elements = this._stripeService.stripe.elements({
            clientSecret: client_secret,
            locale: 'es',
            appearance,
            ...options,
          });
          this.card = this.elements.create('payment', paymentElementOptions);
          this.card.mount(this.paymentMethodElement()?.nativeElement);
        },
        (error) => {
          this.succesAddPayment.emit({ data: null });
        }
      );
  }

  public clearFields() {
    if (this.card) {
      this.card.clear();
    }
  }

  async addPaymentMethod() {
    this._loader.showLoader();
    const { setupIntent, error } = await this._stripeService.stripe.confirmSetup({
      elements: this.elements,
      confirmParams: {},
      redirect: 'if_required',
    });
    this._loader.hideLoader();
    if (error) return;
    this.clearFields();
    this.succesAddPayment.emit({ data: setupIntent });
    this._toastService.success(this._translate.transform('payment-method-added'), {
      duration: 2000,
    });
  }
}
