export interface AppSettings {
  siteName: string;
  siteDescription: string;
  emailFrom: string;
  emailFromName: string;
  paymentCurrency: string;
  paymentStripeMode: string;
  socialInstagram: string;
  socialFacebook: string;
  appVersion: string;
  amountTransactionStripe: string;
  percentTransactionStripe: string;
  percentBodyBooster: string;
  creatorSiteProfile: string;
}

const VALUES_FOR_KEYS = {
  'site-name': 'siteName',
  'site-description': 'siteDescription',
  'email-from': 'emailFrom',
  'email-from_name': 'emailFromName',
  'payment-currency': 'paymentCurrency',
  'payment-stripe_mode': 'paymentStripeMode',
  'social-instagram': 'socialInstagram',
  'social-facebook': 'socialFacebook',
  'app-version': 'appVersion',
  'amount-transaction-stripe': 'amountTransactionStripe',
  'percent-transaction-stripe': 'percentTransactionStripe',
  'percent-body-booster': 'percentBodyBooster',
  'creator-site-profile': 'creatorSiteProfile',
};

export class AppSettingsModel implements AppSettings {
  siteName = 'Body Booster';
  siteDescription = '';
  emailFrom = '';
  emailFromName = '';
  paymentCurrency = '';
  paymentStripeMode = '';
  socialInstagram = '';
  socialFacebook = '';
  appVersion = '';
  amountTransactionStripe = '';
  percentTransactionStripe = '';
  percentBodyBooster = '';
  creatorSiteProfile = '';
  
  constructor(item: any) {
    item.forEach((setting: any) => {
      const key = VALUES_FOR_KEYS[setting.key as keyof typeof VALUES_FOR_KEYS];
      if (key) {
        (this as any)[key] = setting.value;
      }
    });
  }
}
