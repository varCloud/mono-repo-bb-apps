export interface Tag {
  tagId: number;
  name: string;
  description: string;
  active: number;
}

export class TagModel implements Tag {
  tagId: number;
  name: string;
  description: string;
  active: number;

  constructor(data: Tag) {
    this.tagId = data.tagId;
    this.name = data.name;
    this.description = data.description;
    this.active = data.active;
  }
}
