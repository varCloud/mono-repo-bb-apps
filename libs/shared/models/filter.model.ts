export interface Filter {
  workoutTags: WorkoutTag[];
  levels: Level[];
  countFilters: number;
  showWorkoutTags: boolean;
  showLevels: boolean;
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

  workoutTags: WorkoutTag[] = [];
  levels: Level[] = [];
  countFilters = 0;

  constructor(data: Partial<Filter>) {
    this.workoutTags = data.workoutTags || this.workoutTags;
    this.levels = data.levels || this.levels;
    this.countFilters = data.countFilters || this.countFilters;
    this.showWorkoutTags = data.showWorkoutTags || this.showWorkoutTags;
    this.showLevels = data.showLevels || this.showLevels;
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
    return params;
  }
}
