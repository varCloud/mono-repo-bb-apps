export interface User {
  userId: number;
  userTypeId: number;
  firstName: string;
  lastName: string;
  email: string;
  genderId: number;
  registrationDate: Date;
  stripeAccountId: string;
  profileColor: string;
  bio: string;
  accountStatusId: number;
  profilePictureUrl: string;
  frontPageUrl?: string;
  lastLogin: Date;
  updatedAt: Date;
  stripeStatus: string;
  categories: Category[];
  billingCycles: BillingCycle[];
  phone?: string;
  nickName?: string;
  isoCode?: string;
  gender?: string;
  birthdate?: string;
  age?: string;
  weight?: string;
  height?: string;
  levelId?: number;
  pushNotificationToken?: string;
}

export interface Category {
  userCategoriesId: number;
  userId: number;
  categoryId: number;
  createdAt: Date;
  name: string;
  description: string;
}
export interface BillingCycle {
  userBillingCycleId: number;
  billingCycleId: number;
  creatorId: number;
  createdAt: Date;
  updatedAt: Date;
  active: number;
  stripePriceId: string;
  amount: number;
  interval: number;
  description: string;
  isTrialSubscription: boolean;
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
}

export class UserModel implements User {
  userId = 0;
  userTypeId = 0;
  firstName = '';
  lastName = '';
  email = '';
  genderId;
  registrationDate = new Date();
  stripeAccountId = '';
  profileColor = '';
  bio = '';
  accountStatusId = 0;
  profilePictureUrl = '';
  lastLogin = new Date();
  updatedAt = new Date();
  stripeStatus = 'restricted';
  categories = [];
  billingCycles = [];
  nickName?: string | undefined;
  phone?: string;
  weight?: string;
  height?: string;
  levelId?: number;
  birthdate?: string;
  age?: string;
  frontPageUrl?: string;
  constructor(data: any) {
    this.userId = data.userId || 0;
    this.userTypeId = data.userTypeId || 0;
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.email = data.email || '';
    this.genderId = data.genderId || '';
    this.registrationDate = data.registrationDate || new Date();
    this.stripeAccountId = data.stripeAccountId || '';
    this.profileColor = data.profileColor || '';
    this.bio = data.bio || '';
    this.accountStatusId = data.accountStatusId || 0;
    this.profilePictureUrl = data.profilePictureUrl || '';
    this.lastLogin = data.lastLogin || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.stripeStatus = data.stripeStatus || false;
    this.categories = data.categories || [];
    this.billingCycles = data.billingCycles || [];
    this.nickName = data.nickName || '';
    this.phone = data.phone || '';
    this.weight = data.weight || '';
    this.height = data.height || '';
    this.levelId = data.levelId || 0;
    this.birthdate = data.birthdate || '';
    this.age = data.age || '';
    this.frontPageUrl = data.frontPageUrl || '';
  }
}
