import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  type OnInit,
} from '@angular/core';
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
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import {
  CurrencyComponent,
  LayoutContentComponent,
  ListSkeletonComponent,
} from '@monorepo-bb-app/ui';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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
  fullName = computed(() => {
    const creator = this.creator();
    if (!creator) return '';
    return `${creator.firstName} ${creator.lastName}`;
  });
  constructor(private _processSuscriptionService: ProcessSuscriptionService) {}
  ngOnInit(): void {
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
}
