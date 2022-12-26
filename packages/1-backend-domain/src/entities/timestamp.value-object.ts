import { InvalidDateError } from 'shared';

import { ValueObject } from '../ddd/value-object';
import type { DatePort } from '../interfaces/date.interface';

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

  static now(date: DatePort) {
    return new Timestamp(date.nowAsString());
  }
}
