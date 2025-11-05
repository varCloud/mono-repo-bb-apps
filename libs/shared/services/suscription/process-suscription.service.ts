import { Injectable, signal } from '@angular/core';
import { BillingCycle, PaymentMethod, User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ProcessSuscriptionService {
  private creatorSelected = signal<User | null>(null);
  private billingCycle = signal<BillingCycle | null>(null);
  private paymentMethod = signal<PaymentMethod | null>(null);

  constructor() {}

  public setCreator(creator: User) {
    this.creatorSelected.set(creator);
  }

  public clear() {
    this.creatorSelected.set(null);
    this.billingCycle.set(null);
    this.paymentMethod.set(null);
  }

  public getCreator() {
    return this.creatorSelected();
  }

  public setSelectedBillingCycle(billingCycle: BillingCycle) {
    this.billingCycle.set(null);
    this.billingCycle.set(billingCycle);
  }

  public getSelectedBillingCycle() {
    return this.billingCycle();
  }
  public setSelectedPaymentMethod(paymentMethod: PaymentMethod) {
    this.paymentMethod.set(paymentMethod);
  }

  public getSelectedPaymentMethod() {
    return this.paymentMethod();
  }
}
