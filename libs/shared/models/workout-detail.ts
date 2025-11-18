import { Asset, CategoryList } from './workout-response-list';

export interface WorkoutDetailResponse {
  workoutId: number;
  creatorId: number;
  title: string;
  description: string;
  durationMinutes: number | null;
  creationAt: Date | string;
  workoutTypeId: number;
  workoutUrl: string;
  signedUrl: string;
  workerStatusId: number;
  idempotencyKey: string;
  deletedAt: Date | string | null;
  averageRating: string;
  totalRatings: number;
  totalLikes: number;
  difficultyLevels: CategoryList[];
  locations: CategoryList[];
  tags: CategoryList[];
  categories: CategoryList[];
  tools: CategoryList[];
  assets: WorkoutAssetDetail[];
  creator?: CreatorInfo;
}

export interface WorkoutAssetDetail extends Asset {
  signedUrl?: string;
}

export interface CreatorInfo {
  userId: number;
  name: string;
  lastName: string;
  profilePicture: string;
}

export class WorkoutDetailModel implements WorkoutDetailResponse {
  workoutId = 0;
  creatorId = 0;
  title = '';
  description = '';
  durationMinutes = null;
  creationAt: Date | string = new Date();
  workoutTypeId = 0;
  workoutUrl = '';
  signedUrl = '';
  workerStatusId = 0;
  idempotencyKey = '';
  deletedAt = null;
  averageRating = '';
  totalRatings = 0;
  totalLikes = 0;
  difficultyLevels: CategoryList[] = [];
  locations: CategoryList[] = [];
  tags: CategoryList[] = [];
  categories: CategoryList[] = [];
  tools: CategoryList[] = [];
  assets: WorkoutAssetDetail[] = [];
  creator?: CreatorInfo;

  constructor(item: any) {
    this.workoutId = item.workoutId ?? this.workoutId;
    this.creatorId = item.creatorId ?? this.creatorId;
    this.title = item.title ?? this.title;
    this.description = item.description ?? this.description;
    this.durationMinutes = item.durationMinutes ?? this.durationMinutes;
    this.creationAt = item.creationAt ?? this.creationAt;
    this.workoutTypeId = item.workoutTypeId ?? this.workoutTypeId;
    this.workoutUrl = item.workoutUrl ?? this.workoutUrl;
    this.signedUrl = item.signedUrl ?? this.signedUrl;
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
    this.creator = item.creator ?? this.creator;
  }
}

