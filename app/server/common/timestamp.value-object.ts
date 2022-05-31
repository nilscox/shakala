import { ValueObject } from '../ddd/value-object';

import { DateService } from './date.service';
import { DomainError } from './domain-error';

export class InvalidDateError extends DomainError {
  constructor(date: string) {
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

  static create(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new InvalidDateError(value);
    }

    return new Timestamp(value);
  }

  static now(dateService: DateService) {
    return new Timestamp(dateService.nowAsString());
  }
}
