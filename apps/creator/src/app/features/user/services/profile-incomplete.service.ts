import { Injectable, signal } from '@angular/core';
import { Categorie, PaymentFrecuency, User } from '@monorepo-bb-app/shared';

@Injectable({
  providedIn: 'root',
})
export class ProfileIncompleteService {
  private user = signal<User | null>(null);
  private categories = signal<Categorie[]>([]);
  private paymentFrequency = signal<PaymentFrecuency | null>(null);
  constructor() {}

  setCategories(categories: Categorie[]) {
    this.categories.set(categories);
  }
  getCategories(): Categorie[] {
    return this.categories();
  }

  clearCategories() {
    this.categories.set([]);
  }
  setPaymentFrequency(paymentFrequency: PaymentFrecuency) {
    this.paymentFrequency.set(paymentFrequency);
  }
  getPaymentFrequency(): PaymentFrecuency | null {
    return this.paymentFrequency();
  }
  clearPaymentFrequency() {
    this.paymentFrequency.set(null);
  }
  setUser(user: User) {
    this.user.set(user);
  }
  getUser(): User | null {
    return this.user();
  }
  clearUser() {
    this.user.set(null);
  }
}
