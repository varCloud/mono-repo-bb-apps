export interface DifficultyLevel {
  levelId: number;
  levelCode: string;
  description: string;
  active: number;
}

export class DifficultyLevelModel implements DifficultyLevel {
  levelId: number;
  levelCode: string;
  description: string;
  active: number;

  constructor(data: DifficultyLevel) {
    this.levelId = data.levelId;
    this.levelCode = data.levelCode;
    this.description = data.description;
    this.active = data.active;
  }
}
