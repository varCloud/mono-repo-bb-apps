export enum StripeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  RESTRICTED = 'restricted',
}

export interface StripePropertiesAccount {
  isFullyActive: boolean;
  pendingRequirements: any;
  activeCapabilities: string[];
  inactiveCapabilities: any;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  disabledReason: null;
  formattedRequirements: any;
}
