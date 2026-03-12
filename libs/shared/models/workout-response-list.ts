export interface WorkoutResponseList {
  workouts: Workout[];
  meta: Meta;
  links: Links;
}

export interface Links {
  first: string;
  previous: null;
  next: string;
  last: string;
}

export interface Meta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface Workout {
  workoutId: number;
  creatorId: number;
  title: string;
  description: string;
  durationMinutes: null;
  creationAt: Date;
  workoutTypeId: number;
  workoutUrl: string;
  workerStatusId: number;
  idempotencyKey: string;
  deletedAt: null;
  averageRating: string;
  totalRatings: number;
  totalLikes: number;
  difficultyLevels: CategoryList[];
  locations: CategoryList[];
  tags: CategoryList[];
  categories: CategoryList[];
  tools: CategoryList[];
  assets: Asset[];
  creatorEmail?: string;
  creatorNickName?: string;
}

export interface Asset {
  workoutAssetId: number;
  workoutId: number;
  assetUrl: string;
  active: number;
  createdAt: Date;
  updateAt: null;
  deletedAt: null;
  creatorId: number | null;
  idempotencyKey: string;
  name: string;
  description: string;
  signedUrl: string;
  duration: number;
  messages: number;
  likes: number;
  order?: number;
}

export interface CategoryList {
  id: number;
  description: string;
}

export class WorkoutListModel implements Workout {
  workoutId = 0;
  creatorId = 0;
  creatorEmail = '';
  creatorNickName = '';
  title = '';
  description = '';
  durationMinutes = null;
  creationAt = new Date();
  workoutTypeId = 0;
  workoutUrl = '';
  workerStatusId = 0;
  idempotencyKey = '';
  deletedAt = null;
  averageRating = '';
  totalRatings = 0;
  totalLikes = 0;
  difficultyLevels = [];
  locations = [];
  tags = [];
  categories = [];
  tools = [];
  assets = [];

  constructor(item: any) {
    this.workoutId = item.workoutId ?? this.workoutId;
    this.creatorId = item.creatorId ?? this.creatorId;
    this.title = item.title ?? this.title;
    this.description = item.description ?? this.description;
    this.durationMinutes = item.durationMinutes ?? this.durationMinutes;
    this.creationAt = item.creationAt ?? this.creationAt;
    this.workoutTypeId = item.workoutTypeId ?? this.workoutTypeId;
    this.workoutUrl = item.workoutUrl ?? this.workoutUrl;
    this.workerStatusId = item.workerStatusId ?? this.workerStatusId;
    this.idempotencyKey = item.idempotencyKey ?? this.idempotencyKey;
    this.deletedAt = item.deletedAt ?? this.deletedAt;
    this.averageRating = item.averageRating ?? this.averageRating;
    this.totalRatings = item.totalRatings ?? this.totalRatings;
    this.totalLikes = item.totalLikes ?? this.totalLikes;
    this.difficultyLevels = item.difficultyLevels ?? this.difficultyLevels;
    this.locations = item.locations ?? this.locations;
    this.tags = item.tags ?? this.tags;
    this.categories = item.categories ?? this.categories;
    this.tools = item.tools ?? this.tools;
    this.assets = item.assets ?? this.assets;
    this.creatorEmail = item.creator?.email ?? this.creatorEmail;
    this.creatorNickName = item.creator?.nickName ?? this.creatorNickName;
  }
}
