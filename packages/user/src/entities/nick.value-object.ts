import { BaseError, ValueObject } from '@shakala/common';

export class NickTooShortError extends BaseError<{ nick: string; minLength: number }> {
  constructor(nick: string, minLength: number) {
    super('nick is too short', { nick, minLength });
  }
}

export class Nick extends ValueObject<string> {
  constructor(value: string) {
    if (value.length < 3) {
      throw new NickTooShortError(value, 3);
    }

    super(value);
  }

  override toString() {
    return this.value;
  }
}
