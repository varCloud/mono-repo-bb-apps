import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderComponent, LayoutContentComponent, PaymentFrequencySettingsComponent } from '@monorepo-bb-app/ui';
import { PaymentFrecuency, PaymentFrecuencyModel, PaymentFrecuencyRequest } from '@monorepo-bb-app/shared';
import { UserService } from '../../../services/user.service';
import { finalize } from 'rxjs';
import { ToastService } from '@monorepo-bb-app/shared';
import { CommonModule } from '@angular/common';
import { ProfileIncompleteService } from '../../../services/profile-incomplete.service';
import { LoaderUIService } from '@monorepo-bb-app/core';

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
    PaymentFrequencySettingsComponent,
    CommonModule,
  ],
})
export class PaymentFrequencyComponent implements OnInit {
  public paymentFrecuency: PaymentFrecuency[] = [];
  public defaultPaymentFrequency: PaymentFrecuency[] = [];
  public paymentFrecuencyFree: PaymentFrecuency | null = null;
  public isLoading = signal(true);
  public isNextButtonDisabled = signal(true);
  constructor(
    private _router: Router,
    private _userService: UserService,
    private _toastService: ToastService,
    private _translate: TranslateService,
    private _profileIncompleteService: ProfileIncompleteService,
    private readonly _loaderUIService: LoaderUIService
  ) {
    this.isLoading.set(true);
    this._loaderUIService.showLoader();
    this._userService
      .getBillingCycles()
      .pipe(finalize(() => {
        this.isLoading.set(false)
        this._loaderUIService.hideLoader();
      }))
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
    this._loaderUIService.showLoader();
    this.paymentFrecuency.push(this.paymentFrecuencyFree!);
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
      .pipe(finalize(() => {
        this._loaderUIService.hideLoader();
        this.isNextButtonDisabled.set(false)
      }))
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
  onPaymentFrequencyFree(event: PaymentFrecuency) {
    this.paymentFrecuencyFree = event;
  }
}
