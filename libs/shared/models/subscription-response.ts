export interface SubscriptionResponse {
  subscriptionId: number;
  userId: number;
  creatorId: number;
  startDate: Date;
  endDate: null;
  billingCycleId: number;
  amount: string;
  subscriptionStatusId: number;
  lastPaymentDate: null;
  nextPaymentDate: null;
  stripeSubscriptionId: string;
  paymentSubscriptionStatus: PaymentSubscriptionStatus;
}

export interface PaymentSubscriptionStatus {
  id: string;
  status: SubscriptionStatus;
  currentPeriodEnd: null;
  currentPeriodStart: Date;
  cancelAtPeriodEnd: boolean;
  customer: string;
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELED = 'canceled',
}
