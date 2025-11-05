import { Component, signal, type OnInit, computed } from '@angular/core';
import { TitleCasePipe, CurrencyPipe } from '@angular/common';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonBadge,
  IonList,
  IonNote,
  IonItemDivider,
  IonAvatar,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutContentComponent } from '@monorepo-bb-app/ui';
import { addIcons } from 'ionicons';
import { cardOutline, diamondOutline, starOutline, star } from 'ionicons/icons';
import {
  PaymentMethod,
  ProcessSuscriptionService,
  User,
} from '@monorepo-bb-app/shared';
import { BillingCycle } from '../../../../../../../../libs/shared/models/user.model';

@Component({
  selector: 'app-checkout-suscription',
  imports: [
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonIcon,
    IonButton,
    IonBadge,
    IonList,
    IonNote,
    IonAvatar,
    LayoutContentComponent,
    TranslateModule,
    TitleCasePipe,
    CurrencyPipe,
    IonItemDivider,
  ],
  templateUrl: './checkout-suscription.component.html',
  styleUrl: './checkout-suscription.component.scss',
})
export class CheckoutSuscriptionComponent implements OnInit {
  // Información del entrenador
  trainer = signal<User | null>(null);
  paymentMethod = signal<PaymentMethod | null>(null);
  billingCycle = signal<BillingCycle | null>(null);

  // fullName = computed(() => {
  //   return this.trainer().firstName + ' ' + this.trainer().lastName;
  // });

  // subtotal = computed(() => {
  //   return this.billingCycle().amount || 0;
  // });

  // total = computed(() => {
  //   return this.subtotal();
  // });

  constructor(private _processSuscriptionService: ProcessSuscriptionService) {
    addIcons({ diamondOutline, cardOutline, starOutline, star });
  }

  ngOnInit(): void {
    console.log('ngOnInit checkout');
    this.loadCheckoutData();
  }

  ionViewWillEnter(): void {
    console.log('ionViewWillEnter checkout - se ejecuta cada vez que entras');
    this.loadCheckoutData();
  }

  private loadCheckoutData(): void {
    this.billingCycle.set(
      this._processSuscriptionService.getSelectedBillingCycle()
    );
    this.trainer.set(this._processSuscriptionService.getCreator());
    this.paymentMethod.set(
      this._processSuscriptionService.getSelectedPaymentMethod()
    );
  }

  ngOnDestroy(): void {
    console.log('ondestroy');
    this._processSuscriptionService.clear();
  }

  private loadSubscriptionData() {
    // Lógica para cargar datos reales
  }

  public selectPaymentMethod() {
    // Lógica para abrir modal de selección de método de pago
    console.log('Seleccionar método de pago');
  }

  public processPayment() {
    // Lógica para procesar el pago
    console.log('Procesando pago...');
  }
}
