export interface FaqCategories {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export class FaqCategoriesModel implements FaqCategories {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.icon=data.icon;
    this.color=data.color;
  }


}
