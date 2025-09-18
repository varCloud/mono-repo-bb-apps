import {
  Component,
  ElementRef,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';

import {
  IonButton,
  AlertController,
  IonSpinner,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { StripeService } from '@monorepo-bb-app/shared';

@Component({
  selector: 'app-add-payment-method',
  templateUrl: './add-payment-method.component.html',
  styleUrls: ['./add-payment-method.component.scss'],
  imports: [IonSpinner, IonButton, TranslateModule, ReactiveFormsModule],
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
    private alertController: AlertController,
    private _translate: TranslatePipe,
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
    const options = {
      layout: {
        type: 'accordion',
        defaultCollapsed: false,
        radios: true,
        spacedAccordionItems: false,
      },
    };
    this.isLoading.set(true);
    this._stripeService.getSetupIntents(this.customerId()).subscribe(
      (resp) => {
        const { client_secret } = resp as any;
        this.elements = this._stripeService.stripe.elements({
          clientSecret: client_secret,
          appearance,
        });
        this.card = this.elements.create('payment', options);
        this.card.mount(this.paymentMethodElement()?.nativeElement);
        this.isLoading.set(false);
      },
      (error) => {
        this.succesAddPayment.emit({ data: null });
      },
    );
  }

  public clearFields() {
    if (this.card) {
      this.card.clear();
    }
  }

  async addPaymentMethod() {
    const { setupIntent, error } =
      await this._stripeService.stripe.confirmSetup({
        elements: this.elements,
        confirmParams: {},
        redirect: 'if_required',
      });
    if (error) return;
    this.clearFields();
    this.succesAddPayment.emit({ data: setupIntent });
    const alert = await this.alertController.create({
      header: this._translate.transform('payment-method-added'),
      message: this._translate.transform('payment-method-added-success'),
      buttons: ['OK'],
    });

    await alert.present();
  }
}
