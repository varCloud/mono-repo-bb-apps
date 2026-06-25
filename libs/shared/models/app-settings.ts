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
  onlyWorkoutSuscription: string;
  paymentInApp: string;
  unreadPollMs: string;
  athletePlayStoreVersion: string;
  athleteAppStoreVersion: string;
  coachPlayStoreVersion: string;
  coachAppStoreVersion: string;
  athleteLinkPlayStore: string;
  athleteLinkAppStore: string;
  coachLinkPlayStore: string;
  coachLinkAppStore: string;
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
  'only-workout-suscription': 'onlyWorkoutSuscription',
  'payment-in-app': 'paymentInApp',
  'unread_poll_ms': 'unreadPollMs',
  'athlete-play-store-version': 'athletePlayStoreVersion',
  'athlete-app-store-version': 'athleteAppStoreVersion',
  'coach-play-store-version': 'coachPlayStoreVersion',
  'coach-app-store-version': 'coachAppStoreVersion',
  'athlete-link-play-store': 'athleteLinkPlayStore',
  'athlete-link-app-store': 'athleteLinkAppStore',
  'coach-link-play-store': 'coachLinkPlayStore',
  'coach-link-app-store': 'coachLinkAppStore',
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
  onlyWorkoutSuscription = '';
  paymentInApp = '';
  unreadPollMs = '';
  athletePlayStoreVersion = '';
  athleteAppStoreVersion = '';
  coachPlayStoreVersion = '';
  coachAppStoreVersion = '';
  athleteLinkPlayStore = '';
  athleteLinkAppStore = '';
  coachLinkPlayStore = '';
  coachLinkAppStore = '';
  constructor(item: any) {
    item.forEach((setting: any) => {
      const key = VALUES_FOR_KEYS[setting.key as keyof typeof VALUES_FOR_KEYS];
      if (key) {
        (this as any)[key] = setting.value;
      }
    });
  }
}
