
export interface ConfigItem {
  id: number;
  key: string;
  value: string;
}

export interface AppConfig2Model {
  'site-name'?: string;
  'site-description'?: string;
  'email-from'?: string;
  'email-from_name'?: string;
  'payment-currency'?: string;
  'payment-stripe_mode'?: string;
  'social-instagram'?: string;
  'social-facebook'?: string;
  'app-version'?: string;
  'amount-transaction-stripe'?: string;
  'percent-transaction-stripe'?: string;
  'percent-body-booster'?: string;
  'email-from-support'?: string;
  'phone-support'?: string;


  [key: string]: string | undefined;
}

