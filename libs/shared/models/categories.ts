export interface Categorie {
  categoryId: number;
  name: string;
  description: string;
  active: number;
  selected?: boolean;
}

interface CategoryId {
  id: number;
}

export interface SaveCategoriesRequest {
  categories: CategoryId[];
}

export interface CategoryByUser {
  userCategoriesId: number;
  userId: number;
  categoryId: number;
  createdAt: Date;
}

export class CategorieModel implements Categorie {
  categoryId = 0;
  name = '';
  description = '';
  active = 0;
  selected = false;

  constructor(item: any) {
    this.categoryId = item.categoryId ?? item.category_id ?? this.categoryId;
    this.name = item.name ?? this.name;
    this.description = item.description ?? this.description;
    this.active = item.active ?? this.active;
    this.selected = item.selected ?? false;
  }
}

export class CategoryByUserModel implements CategoryByUser {
  userCategoriesId = 0;
  userId = 0;
  categoryId = 0;
  createdAt = new Date();

  constructor(item: any) {
    this.userCategoriesId = item.userCategoriesId ?? this.userCategoriesId;
    this.userId = item.userId ?? this.userId;
    this.categoryId = item.categoryId ?? this.categoryId;
    this.createdAt = item.createdAt ? new Date(item.createdAt) : this.createdAt;
  }
}
