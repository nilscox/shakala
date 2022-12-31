import { BaseError } from '@shakala/shared';

export type PaginationData = Partial<{
  page: number;
  pageSize: number;
}>;

export type Paginated<T> = {
  items: T[];
  total: number;
};

class InvalidPageNumberError extends BaseError<{ page: number; error: string }> {
  constructor(page: number, error: string) {
    super('invalid page number', { page, error });
  }
}

class InvalidPageSizeError extends BaseError<{ pageSize: number; error: string }> {
  constructor(pageSize: number, error: string) {
    super('invalid page size', { pageSize, error });
  }
}

export class Pagination {
  constructor(public readonly page: number, public readonly pageSize: number) {}

  get limit() {
    return this.pageSize;
  }

  get offset() {
    return (this.page - 1) * this.pageSize;
  }

  static get firstPage() {
    return this.from({});
  }

  static from(data: PaginationData | undefined) {
    const page = data?.page ?? 1;
    const pageSize = data?.pageSize ?? 20;

    Pagination.validateNumberValue(page, InvalidPageNumberError);
    Pagination.validateNumberValue(pageSize, InvalidPageSizeError);

    return new Pagination(page, pageSize);
  }

  static validateNumberValue(
    value: number,
    ErrorClass: typeof InvalidPageNumberError | typeof InvalidPageSizeError,
  ) {
    if (!Number.isFinite(value)) {
      throw new ErrorClass(value, 'must be a finite number');
    }

    if (value < 0) {
      throw new ErrorClass(value, 'must not be negative');
    }

    if (value === 0) {
      throw new ErrorClass(value, 'must not be zero');
    }
  }
}
