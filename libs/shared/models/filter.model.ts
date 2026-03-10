import { Category } from "./user.model";

export interface Filter {
  workoutTags: WorkoutTag[];
  levels: Level[];
  categories: Category[];
  countFilters: number;
  showWorkoutTags: boolean;
  showLevels: boolean;
  showCategories: boolean;
}

export interface WorkoutTag {
  tagId: number;
  name: string;
}

export interface Level {
  levelId: number;
  name: string;
}

export class FilterModel implements Filter {
  showWorkoutTags = false;
  showLevels = false;
  showCategories = false;

  workoutTags: WorkoutTag[] = [];
  levels: Level[] = [];
  categories: Category[] = [];
  countFilters = 0;

  constructor(data: Partial<Filter>) {
    this.workoutTags = data.workoutTags || this.workoutTags;
    this.levels = data.levels || this.levels;
    this.categories = data.categories || this.categories;
    this.countFilters = data.countFilters || this.countFilters;
    this.showWorkoutTags = data.showWorkoutTags || this.showWorkoutTags;
    this.showLevels = data.showLevels || this.showLevels;
    this.showCategories = data.showCategories || this.showCategories;
  }

  public get activeFiltersCount(): number {
    let count = 0;
    if (this.workoutTags && this.workoutTags.length > 0) count++;
    if (this.levels && this.levels.length > 0) count++;
    if (this.categories && this.categories.length > 0) count++;
    return count;
  }

  public toQueryParams(): any {
    const params: any = {};
    if (this.workoutTags && this.workoutTags.length > 0) {
      params.workoutTags = this.workoutTags.map((tag) => tag.tagId);
      this.countFilters += 1;
    }
    if (this.levels && this.levels.length > 0) {
      params.levelIds = this.levels.map((level) => level.levelId);
      this.countFilters += 1;
    }
    if (this.categories && this.categories.length > 0) {
      params.categoryIds = this.categories.map((cat) => cat.categoryId);
      this.countFilters += 1;
    }
    return params;
  }
}
