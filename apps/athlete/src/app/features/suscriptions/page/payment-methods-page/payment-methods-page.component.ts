import { Component, signal, type OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonGrid,
  IonContent,
  IonButton,
  IonText,
} from '@ionic/angular/standalone';
import { SesionService } from '@monorepo-bb-app/core';
import { ProcessSuscriptionService } from '@monorepo-bb-app/shared';
import {
  LayoutContentComponent,
  PaymentMethodsListComponent,
} from '@monorepo-bb-app/ui';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { cardOutline } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-methods-page',
  imports: [
    IonText,
    IonContent,
    IonGrid,
    LayoutContentComponent,
    TranslateModule,
    IonButton,
    FormsModule,
    CommonModule,
    RouterLink,
    PaymentMethodsListComponent,
  ],
  templateUrl: './payment-methods-page.component.html',
  styleUrl: './payment-methods-page.component.scss',
})
export class PaymentMethodsPageComponent implements OnInit {
  isSelectedPaymentMethod = signal<boolean>(false);

  paymentMethodId = computed(
    () => this._processSuscriptionService.getSelectedPaymentMethod()?.id || null
  );

  constructor(
    public _sesisonService: SesionService,
    private _processSuscriptionService: ProcessSuscriptionService
  ) {
    addIcons({ cardOutline });
  }

  ngOnInit(): void {}

  public selectPaymentMethod(method: any) {
    this._processSuscriptionService.setSelectedPaymentMethod(method);
    this.isSelectedPaymentMethod.set(true);
  }
}
