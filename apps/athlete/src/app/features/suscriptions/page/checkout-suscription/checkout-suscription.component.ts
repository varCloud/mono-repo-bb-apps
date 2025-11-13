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
  IonBackButton,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutContentComponent } from '@monorepo-bb-app/ui';
import { addIcons } from 'ionicons';
import {
  cardOutline,
  diamondOutline,
  starOutline,
  star,
  chevronForward,
  receiptOutline,
  lockClosed,
} from 'ionicons/icons';
import {
  PaymentMethod,
  ProcessSuscriptionService,
  SuscriptionService,
  ToastService,
  User,
} from '@monorepo-bb-app/shared';
import { BillingCycle } from '../../../../../../../../libs/shared/models/user.model';
import { LoaderUIService, SesionService } from '@monorepo-bb-app/core';
import { finalize } from 'rxjs';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-checkout-suscription',
  imports: [
    IonBackButton,
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
  trainer = computed(() => {
    return this._processSuscriptionService.getCreator();
  });

  paymentMethod = computed(() => {
    return this._processSuscriptionService.getSelectedPaymentMethod();
  });

  billingCycle = computed(() => {
    return this._processSuscriptionService.getSelectedBillingCycle();
  });

  subtotal = computed(() => {
    return this.billingCycle().amount || 0;
  });

  total = computed(() => {
    return this.subtotal();
  });

  constructor(
    private _processSuscriptionService: ProcessSuscriptionService,
    private _suscriptionService: SuscriptionService,
    private _sesionService: SesionService,
    private _loader: LoaderUIService,
    private _toastService: ToastService,
    private _router: Router
  ) {
    addIcons({
      diamondOutline,
      cardOutline,
      starOutline,
      star,
      chevronForward,
      receiptOutline,
      lockClosed,
    });
  }

  ngOnInit(): void {}

  private loadSubscriptionData() {
    // Lógica para cargar datos reales
  }

  public selectPaymentMethod() {
    // Lógica para abrir modal de selección de método de pago
    console.log('Seleccionar método de pago');
  }

  public processPayment() {
    this._loader.showLoader();
    const data = {
      athleteId: this._sesionService.user$().userId,
      creatorId: this.trainer()?.userId,
      userBillingCycleId: this.billingCycle().userBillingCycleId,
      paymentMethodId: this.paymentMethod()?.id,
    };
    this._suscriptionService
      .createSuscription(data)
      .pipe(finalize(() => this._loader.hideLoader()))
      .subscribe({
        next: (response) => {
          this._toastService.success('Suscripción creada con éxito.', {
            duration: 1000,
          });
          this._router.navigate(['/home']);
        },
        error: (error) => {
          const messageError = error?.error?.message || 'Error al crear la suscripción.';
          this._toastService.error(messageError, {
            duration: 1000,
          });
        },
      });
  }
}
