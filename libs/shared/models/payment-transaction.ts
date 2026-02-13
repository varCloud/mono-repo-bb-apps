import { CONSTANTS } from '../constants/constants';

export interface PaymentUser {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  nickName: string;
  profilePictureUrl?: string;
}

export class PaymentUserModel implements PaymentUser {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  nickName: string;
  profilePictureUrl: string;

  constructor(data: any) {
    this.userId = data.userId;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.nickName = data.nickName;
    this.profilePictureUrl = data.profilePictureUrl || CONSTANTS.DEFAULT_URL_AVATAR;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

export interface PaymentTransaction {
  transactionId: number;
  amount: number;
  currency: string;
  platformFee: number;
  creatorPayout: number;
  stripeFee: number;
  netAmount: number;
  transactionStatusId: number;
  transactionStatusCode: string;
  transactionStatusDescription: string;
  paymentMethodType?: string;
  invoiceNumber: string;
  invoicePdfUrl: string;
  receiptUrl: string;
  transactionDate: string;
  paidAt: string;
  periodStart: string;
  periodEnd: string;
  billingReason: string;
  isRefunded: boolean;
  refundedAmount: number;
  subscriptionId: number;
  athlete: PaymentUserModel;
  creator: PaymentUserModel;
}

export class PaymentTransactionModel implements PaymentTransaction {
  transactionId: number;
  amount: number;
  currency: string;
  platformFee: number;
  creatorPayout: number;
  stripeFee: number;
  netAmount: number;
  transactionStatusId: number;
  transactionStatusCode: string;
  transactionStatusDescription: string;
  paymentMethodType?: string;
  invoiceNumber: string;
  invoicePdfUrl: string;
  receiptUrl: string;
  transactionDate: string;
  paidAt: string;
  periodStart: string;
  periodEnd: string;
  billingReason: string;
  isRefunded: boolean;
  refundedAmount: number;
  subscriptionId: number;
  athlete: PaymentUserModel;
  creator: PaymentUserModel;

  constructor(data: any) {
    this.transactionId = data.transactionId;
    this.amount = data.amount;
    this.currency = data.currency;
    this.platformFee = data.platformFee;
    this.creatorPayout = data.creatorPayout;
    this.stripeFee = data.stripeFee;
    this.netAmount = data.netAmount;
    this.transactionStatusId = data.transactionStatusId;
    this.transactionStatusCode = data.transactionStatusCode;
    this.transactionStatusDescription = data.transactionStatusDescription;
    this.paymentMethodType = data.paymentMethodType;
    this.invoiceNumber = data.invoiceNumber;
    this.invoicePdfUrl = data.invoicePdfUrl;
    this.receiptUrl = data.receiptUrl;
    this.transactionDate = data.transactionDate;
    this.paidAt = data.paidAt;
    this.periodStart = data.periodStart;
    this.periodEnd = data.periodEnd;
    this.billingReason = data.billingReason;
    this.isRefunded = data.isRefunded;
    this.refundedAmount = data.refundedAmount;
    this.subscriptionId = data.subscriptionId;
    this.athlete = new PaymentUserModel(data.athlete);
    this.creator = new PaymentUserModel(data.creator);
  }

  get formattedAmount(): string {
    return `${this.amount} ${this.currency}`;
  }

  get formattedDate(): string {
    return new Date(this.transactionDate).toLocaleDateString();
  }

  get isCompleted(): boolean {
    return this.transactionStatusId === 2; // Completado
  }

  get billingTypeLabel(): string {
    switch (this.billingReason) {
      case 'subscription_create':
        return 'Suscripción inicial';
      case 'subscription_cycle':
        return 'Pago recurrente';
      default:
        return this.billingReason;
    }
  }
}

export interface PaymentResponse {
  status: boolean;
  mensaje: string;
  data: {
    items: PaymentTransaction[];
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
    links: {
      first: string;
      previous: string | null;
      next: string | null;
      last: string;
    };
  };
}

export interface PaymentFilters {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}