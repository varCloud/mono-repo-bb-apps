import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BlockUI, BlockUIModule, NgBlockUI } from 'ng-block-ui';
import { HeaderComponent, LayoutContentComponent, PaymentFrequencySettingsComponent } from '@monorepo-bb-app/ui';
import { PaymentFrecuency, PaymentFrecuencyModel, PaymentFrecuencyRequest } from '@monorepo-bb-app/shared';
import { UserService } from '../../../services/user.service';
import { finalize } from 'rxjs';
import { ToastService } from '@monorepo-bb-app/shared';
import { CommonModule } from '@angular/common';
import { ProfileIncompleteService } from '../../../services/profile-incomplete.service';

@Component({
  selector: 'app-payment-frequency',
  templateUrl: './payment-frequency.component.html',
  styleUrls: ['./payment-frequency.component.scss'],
  imports: [
    IonButton,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    LayoutContentComponent,
    HeaderComponent,
    TranslateModule,
    BlockUIModule,
    PaymentFrequencySettingsComponent,
    CommonModule,
  ],
})
export class PaymentFrequencyComponent implements OnInit {
  @BlockUI('payment-frequency-page') paymentFrequencyBlockUI!: NgBlockUI;
  public paymentFrecuency: PaymentFrecuency[] = [];
  public defaultPaymentFrequency: PaymentFrecuency[] = [];
  public isLoading = signal(true);
  public isNextButtonDisabled = signal(true);
  constructor(
    private _router: Router,
    private _userService: UserService,
    private _toastService: ToastService,
    private _translate: TranslateService,
    private _profileIncompleteService: ProfileIncompleteService,
  ) {
    this.isLoading.set(true);
    this._userService
      .getBillingCycles()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((cycles) => {
        this.defaultPaymentFrequency =
          cycles.map(
            (item) =>
              new PaymentFrecuencyModel({
                cycleId: item.billingCycleId,
                amount: item.amount,
                stripeProductId: item.stripePriceId,
              }),
          ) ?? [];
      });
  }

  ngOnInit() {}

  onPaymentFrequencySelected(event: PaymentFrecuency[]) {
    this.paymentFrecuency = event;
  }

  onNextButtonClick() {
    if (this.paymentFrecuency.length < 1) {
      return;
    }
    this.isNextButtonDisabled.set(true);

    const payload: PaymentFrecuencyRequest[] = this.paymentFrecuency.map(
      (item) => ({
        cycleId: item.cycleId,
        amount: item.amount,
        stripeProductId: item.stripeProductId,
        description: item.description,
        interval: item.interval,
      }),
    );
    this._userService
      .savePaymentFrequency(payload)
      .pipe(finalize(() => this.isNextButtonDisabled.set(false)))
      .subscribe({
        next: () => {
          this._toastService.success(
            this._translate.instant('payment-frequency.save-success'),
            {
              duration: 1000,
            },
          );
          this._router.navigate(['/profile-incomplete/about-me']);
        },
        error: () => {
          this._toastService.error(
            this._translate.instant('payment-frequency.save-error'),
            {
              duration: 1000,
            },
          );
        },
      });
  }
}
