/**
 * Interface para definir la estructura de un deep link parseado
 */
export interface DeepLinkData {
  scheme: string;
  host: string;
  path?: string;
  params: Map<string, string>;
  rawUrl: string;
}

/**
 * Enum para los diferentes tipos de hosts de deep links
 */
export enum DeepLinkHost {
  STRIPE_RETURN = 'stripe-return',
  OPEN = 'open',
  ONBOARDING = 'onboarding',
  PROFILE = 'profile',
  PAYMENT_SUCCESS = 'payment-success',
}

/**
 * Enum para acciones específicas en deep links
 */
export enum DeepLinkAction {
  ONBOARDING_COMPLETE = 'onboarding_complete',
  PROFILE_UPDATE = 'profile_update',
  STRIPE_SUCCESS = 'stripe_success'
}