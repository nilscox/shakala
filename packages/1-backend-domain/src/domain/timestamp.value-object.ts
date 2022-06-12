import { ValueObject } from '../ddd/value-object';
import type { DateService } from '../interfaces/date.interface';

import { DomainError } from './domain-error';

export class InvalidDateError extends DomainError<{ date: string | Date }> {
  constructor(date: string | Date) {
    super('Date is not valid', { date });
  }
}

export class Timestamp extends ValueObject<string> {
  get value() {
    return this.val;
  }

  get epoch() {
    return new Date(this.val).getTime();
  }

  static create(value: string | Date) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new InvalidDateError(value);
    }

    return new Timestamp(date.toISOString());
  }

  static now(dateService: DateService) {
    return new Timestamp(dateService.nowAsString());
  }
}
