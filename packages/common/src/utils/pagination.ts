export type PaginationData = {
  page: number;
  pageSize: number;
};

export type Paginated<T> = {
  items: T[];
  total: number;
};

export type PaginatedItem<T> = T extends Paginated<infer Item> ? Item : never;

export class Pagination {
  constructor(public readonly page: number, public readonly pageSize: number) {}

  static from(data: PaginationData) {
    return new Pagination(data.page, data.pageSize);
  }

  get limit() {
    return this.pageSize;
  }

  get offset() {
    return (this.page - 1) * this.pageSize;
  }
}
