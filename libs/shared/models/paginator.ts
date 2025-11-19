export interface PaginatorMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatorLinks {
  first: string;
  previous: string | null;
  next: string | null;
  last: string;
}

export interface Paginator {
  meta: PaginatorMeta;
  links: PaginatorLinks;
}

export class PaginatorMetaModel implements PaginatorMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;

  constructor(data: PaginatorMeta) {

    this.totalItems = data.totalItems;
    this.itemCount = data.itemCount;
    this.itemsPerPage = data.itemsPerPage;
    this.totalPages = data.totalPages;
    this.currentPage = data.currentPage;
  }
}

export class PaginatorLinksModel implements PaginatorLinks {
  first: string;
  previous: string | null;
  next: string | null;
  last: string;

  constructor(data: PaginatorLinks) {
    this.first = data.first;
    this.previous = data.previous;
    this.next = data.next;
    this.last = data.last;
  }
}

export class PaginatorModel implements Paginator {
  meta: PaginatorMeta;
  links: PaginatorLinks;

  constructor(data: Paginator) {
    this.meta = new PaginatorMetaModel(data.meta);
    this.links = new PaginatorLinksModel(data.links);
  }
}
