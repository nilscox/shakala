import { ValueObject } from '../ddd/value-object';
import { BaseError } from '../utils/base-error';

export class Timestamp extends ValueObject<string> {
  constructor(value: number | string | Date) {
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
}

export class InvalidDateError extends BaseError<{ date: number | string | Date }> {
  status = 400;

  constructor(date: number | string | Date) {
    super('date is not valid', { date });
  }
}
