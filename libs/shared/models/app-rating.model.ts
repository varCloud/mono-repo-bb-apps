export interface AppRatingUser {
  id: number;
  email: string;
  nickName: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

export interface AppRating {
  appRatingId: number;
  appTypeId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: AppRatingUser;
}

export class AppRatingModel implements AppRating {
  appRatingId: number;
  appTypeId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: AppRatingUser;

  constructor(data: AppRating) {
    this.appRatingId = data.appRatingId;
    this.appTypeId = data.appTypeId;
    this.rating = +data.rating;
    this.comment = data.comment;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.user = data.user;
  }
}
