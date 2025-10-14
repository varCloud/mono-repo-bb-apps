import { ENUM_TYPE_USER } from '../constants/enums';

export interface LoginCredentials {  
  email: string;
  password: string;
  userType?: ENUM_TYPE_USER;
}

export interface UserCreateAccountPayload {
  email: string;
  passwordHash: string;
  userTypeId?: number;
}

export interface UserResponse {
  userId: number;
  email: string;
  stripeAccountId: string;
  hasNullProfileFields: boolean;
  token: string;
}