import { BaseError } from './base-error';

type Details = Record<string, unknown> | undefined;

export class UnexpectedError extends BaseError<Details> {
  public readonly details: Record<string, unknown> | undefined;

  constructor(message = 'unexpected error', details?: Details) {
    super(message);
    this.details = details;
  }
}
