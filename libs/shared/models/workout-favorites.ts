export interface Favorite {
  favoriteId: number;
  savedAt: Date;
  workout: WorkoutFavorite;
}

export interface WorkoutFavorite {
  workoutId: number;
  title: string;
  description: string;
  averageRating: string;
  totalLikes: number;
  creatorId: number;
}
