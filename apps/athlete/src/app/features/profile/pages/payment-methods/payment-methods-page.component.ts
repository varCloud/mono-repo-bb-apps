import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonGrid,
  IonContent,
} from '@ionic/angular/standalone';
import { SesionService } from '@monorepo-bb-app/core';
import {
  LayoutContentComponent,
  PaymentMethodsListComponent,
} from '@monorepo-bb-app/ui';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { cardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-payment-methods-page',
  imports: [
    IonContent,
    IonGrid,
    LayoutContentComponent,
    TranslateModule,
    CommonModule,
    PaymentMethodsListComponent,
  ],
  templateUrl: './payment-methods-page.component.html',
  styleUrl: './payment-methods-page.component.scss',
})
export class PaymentMethodsPageComponent {
  paymentMethodId = signal<string | null>(null);

  constructor(
    public _sessionService: SesionService,
  ) {
    addIcons({ cardOutline });
  }

  public selectPaymentMethod(method: any) {
    this.paymentMethodId.set(method?.id || null);
  }
}
