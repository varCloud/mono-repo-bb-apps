export interface UserCreateAccountPayload {
  email: string;
  passwordHash: string;
  userTypeId?: number;
}
