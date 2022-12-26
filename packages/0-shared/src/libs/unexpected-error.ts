import { BaseError } from './base-error';

type Details = Record<string, unknown> | undefined;

export class UnexpectedError extends BaseError<Details> {
  constructor(message = 'unexpected error', details?: Details) {
    super(message, details);
  }
}
