import { ChangeDetectionStrategy, Component, computed, signal, type OnInit } from '@angular/core';
import { ProcessSuscriptionService, User } from '@monorepo-bb-app/shared';
import {
  IonContent,
  IonGrid,
  IonButton,
  IonItem,
  IonRadioGroup,
  IonNote,
  IonRadio,
  IonLabel,
  IonText,
  IonBackButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import {
  CurrencyComponent,
  LayoutContentComponent,
  ListSkeletonComponent,
} from '@monorepo-bb-app/ui';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { caretBack, chevronBackOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-detail-suscription-creator',
  imports: [
    IonBackButton,
    IonText,
    IonLabel,
    IonRadio,
    IonNote,
    IonRadioGroup,
    IonItem,
    IonButton,
    IonGrid,
    IonIcon,
    IonContent,
    TranslateModule,
    LayoutContentComponent,
    CurrencyComponent,
    ListSkeletonComponent,
    CommonModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './detail-suscription-creator.component.html',
  styleUrl: './detail-suscription-creator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailSuscriptionCreatorComponent implements OnInit {
  creator = signal<User | null>(null);
  selectedPaymentFrequencyId = signal<number | null>(null);
  isIos = Capacitor.getPlatform() === 'ios';
  fullName = computed(() => {
    const creator = this.creator();
    if (!creator) return '';
    return `${creator.firstName} ${creator.lastName}`;
  });
  constructor(
    private _processSuscriptionService: ProcessSuscriptionService,
    private _router: Router
  ) {
    addIcons({ caretBack, chevronBackOutline });
  }
  ngOnInit(): void {
    if (!this._processSuscriptionService.getCreator()) {
      this._router.navigate(['/home']);
      return;
    }
    this.creator.set(this._processSuscriptionService.getCreator());
    this.creator.update((creator) => {
      creator?.billingCycles.sort((a, b) => a.interval - b.interval);
      return creator;
    });
    this.selectPaymentFrequency(this.creator()?.billingCycles[0]);
  }

  selectPaymentFrequency(payment: any) {
    this.selectedPaymentFrequencyId.set(payment.billingCycleId);
    this._processSuscriptionService.setSelectedBillingCycle(payment);
  }

  goToPaymentMethods() {
    this._router.navigate(['/home/suscriptions/payment-methods']);
  }
}
