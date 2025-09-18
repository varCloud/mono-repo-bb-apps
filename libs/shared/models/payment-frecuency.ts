export interface PaymentFrecuency {
  cycleId: number;
  cycleCode: string;
  description: string;
  active: number;
  interval: number;
  stripeProductId: string;
  amount: number;
  amountMin: number;
  amountMax: number;
  isRecommended?: boolean;
}

export interface PaymentFrecuencyRequest {
  cycleId: number;
  amount: number;
  stripeProductId: string;
  description: string;
  interval: number;
}

export class PaymentFrecuencyModel implements PaymentFrecuency {
  cycleId = 0;
  cycleCode = '';
  description = '';
  active = 0;
  interval = 0;
  stripeProductId = '';
  amount = 0;
  amountMin = 0;
  amountMax = 0;
  isRecommended? = false;

  constructor(item: any) {
    this.cycleId = item.cycleId ?? item.cycle_id ?? this.cycleId;
    this.cycleCode = item.cycleCode ?? item.cycle_code ?? this.cycleCode;
    this.description = item.description ?? this.description;
    this.active = item.active ?? item.active ?? this.active;
    this.interval = item.interval ?? item.interval ?? this.interval;
    this.stripeProductId =
      item.stripeProductId ?? item.stripe_product_id ?? this.stripeProductId;

    this.amountMin = item.amountMin ?? item.amount_min ?? this.amountMin;
    this.amountMax = item.amountMax ?? item.amount_max ?? this.amountMax;
    this.amount = item.amount ?? this.amountMin ?? this.amount;
    this.isRecommended = item.isRecommended ?? this.isRecommended;
  }
}
