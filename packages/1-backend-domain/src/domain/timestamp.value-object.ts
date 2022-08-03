import { ValueObject } from '../ddd/value-object';
import type { DateService } from '../interfaces/date.interface';

import { DomainError } from './domain-error';

export class InvalidDateError extends DomainError<{ date: string | Date }> {
  constructor(date: string | Date) {
    super('Date is not valid', { date });
  }
}

export class Timestamp extends ValueObject<string> {
  constructor(value: string | Date) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new InvalidDateError(value);
    }

    super(date.toISOString());
  }

  override toString() {
    return this.value;
  }

  toDate() {
    return new Date(this.value);
  }

  get epoch() {
    return this.toDate().getTime();
  }

  static now(dateService: DateService) {
    return new Timestamp(dateService.nowAsString());
  }
}
