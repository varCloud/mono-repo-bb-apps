import { Component, type OnInit, computed } from '@angular/core';
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
  CONSTANTS,
  ProcessSuscriptionService,
  SuscriptionService,
  ToastService,
} from '@monorepo-bb-app/shared';
import { LoaderUIService, SesionService } from '@monorepo-bb-app/core';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

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
  public defaultProfilePicture = CONSTANTS.DEFAULT_URL_AVATAR;
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

  public selectPaymentMethod() {
    this._router.navigate(['/home/suscriptions/payment-methods']);
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
          this._toastService.error('Error al crear la suscripción.', {
            duration: 1000,
          });
        },
      });
  }
}
