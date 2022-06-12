import { ValueObject } from '../ddd/value-object';

import { DomainError } from './domain-error';

export class NickTooShortError extends DomainError<{ nick: string; minLength: number }> {
  constructor(nick: string, minLength: number) {
    super('Nick is too short', { nick, minLength });
  }
}

export class Nick extends ValueObject<string> {
  get value() {
    return this.val;
  }

  static create(value: string) {
    if (value.length < 3) {
      throw new NickTooShortError(value, 3);
    }

    return new Nick(value);
  }
}
