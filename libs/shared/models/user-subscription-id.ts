export interface SubscriptionUser {
  id: number;
  name: string;
  nickName: string;
  email: string;
  profilePictureUrl: string;
  phone: string;
}

// Modelo para cada objeto de suscripción en el array
export interface Subscription {
  subscriptionId: number;
  startDate: string; // O Date, pero string es más seguro desde JSON
  endDate: string | null;
  billingCycleId: number;
  amount: string;
  subscriptionStatusId: number;
  stripeSubscriptionId: string;
  user: SubscriptionUser;
}

// Modelo para la respuesta completa de la API
export interface ApiResponse {
  data: Subscription[];
}
