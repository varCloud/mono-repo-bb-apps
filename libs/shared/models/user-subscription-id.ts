import { CONSTANTS } from '../constants/constants';

export interface SubscriptionUser {
  id: number;
  name: string;
  nickName: string;
  email: string;
  profilePictureUrl: string;
  phone: string;
  fullDescription: string;
}

export class SubscriptionUserModel implements SubscriptionUser {
  id: number;
  name: string;
  nickName: string;
  email: string;
  profilePictureUrl: string;
  phone: string;
  fullDescription: string;
  constructor(data : any) {
    this.email = data.email;
    this.id = data.id;
    this.name = data.name;
    this.fullDescription = data.fullDescription;
    this.nickName = data.nickName;
    this.phone = data.phone;
    this.profilePictureUrl = data.profilePictureUrl;
    this._setProfilePictureUrl();
  }

  private _setProfilePictureUrl() {
    if (this.profilePictureUrl == "") {
      this.profilePictureUrl = CONSTANTS.DEFAULT_AVATAR;
    }
  }
}

export interface Subscription {
  subscriptionId: number;
  fullDescription: string;
  startDate: string;
  endDate: string | null;
  billingCycleId: number;
  amount: string;
  subscriptionStatusId: number;
  stripeSubscriptionId: string;
  user: SubscriptionUserModel;
}

export class SubscriptionModel implements Subscription {
  subscriptionId: number;
  fullDescription: string;
  startDate: string;
  endDate: string;
  billingCycleId: number;
  amount: string;
  subscriptionStatusId: number;
  stripeSubscriptionId: string;
  user: SubscriptionUserModel;

  constructor(data: any) {
    this.subscriptionId = data.subscriptionId;
    this.fullDescription = data.fullDescription;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.billingCycleId = data.billingCycleId;
    this.amount = data.amount;
    this.subscriptionStatusId = data.subscriptionStatusId;
    this.stripeSubscriptionId = data.stripeSubscriptionId;
    this.user = new SubscriptionUserModel(data.user);
  }
}
export interface ApiResponse {
  data: Subscription[];
}
