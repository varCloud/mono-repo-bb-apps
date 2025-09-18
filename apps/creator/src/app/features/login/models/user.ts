export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserResponse {
  userId: number;
  email: string;
  stripeAccountId: string;
  hasNullProfileFields: boolean;
  token: string;
}