export interface Rating {
  ratingId: number;
  workoutAssetId: number;
  rating: number;
  comment: string;
  user: UserRating;
  createAt?: string;
}

export interface UserRating {
  id: number;
  email: string;
  nickName: string;
  avatar: string;
}

export class RatingModel implements Rating {
  ratingId: number;
  workoutAssetId: number;
  rating: number;
  comment: string;
  user: UserRating;
  createAt?: string;

  constructor(data: Rating) {
    this.ratingId = data.ratingId;
    this.workoutAssetId = data.workoutAssetId;
    this.rating = +data.rating;
    this.comment = data.comment;
    this.user = data.user;
    this.createAt = data.createAt;
  }
}
