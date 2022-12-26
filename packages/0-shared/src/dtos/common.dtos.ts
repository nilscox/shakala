import { BaseError } from '../libs';
import { isEnumValue } from '../libs/is-enum-value';

export enum Sort {
  relevance = 'relevance',
  dateAsc = 'date-asc',
  dateDesc = 'date-desc',
}

export const isSort = isEnumValue(Sort);

export type HttpErrorBody = {
  /** unique error identifier */
  code: string;

  /** plain english error description */
  message: string;

  /** custom payload */
  details?: Record<string, unknown>;
};

export class InvalidDateError extends BaseError<{ date: string | Date }> {
  status = 400;

  constructor(date: string | Date) {
    super('date is not valid', { date });
  }
}

export class NotFound extends BaseError<unknown> {
  status = 404;

  constructor(message = 'not found', details?: unknown) {
    super(message, details);
  }
}

export class NotImplemented extends BaseError {
  status = 501;

  constructor() {
    super('not implemented');
  }
}
