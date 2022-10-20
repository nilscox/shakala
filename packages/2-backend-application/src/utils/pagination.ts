export type PaginationData = Partial<{
  page: number;
  pageSize: number;
}>;

export type Paginated<T> = {
  items: T[];
  total: number;
};

export class PaginationError extends Error {
  constructor(private key: string, private value: number, message: string, private _details: string) {
    super(message);
  }

  get details() {
    return {
      details: this._details,
      [this.key]: this.value,
    };
  }
}

class InvalidPageNumberError extends PaginationError {
  constructor(public readonly page: number, details: string) {
    super('page', page, 'invalid page number', details);
  }
}

class InvalidPageSizeError extends PaginationError {
  constructor(public readonly pageSize: number, details: string) {
    super('pageSize', pageSize, 'invalid page size', details);
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
