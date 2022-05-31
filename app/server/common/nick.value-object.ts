import { ValueObject } from '../ddd/value-object';

import { DomainError } from './domain-error';

export class NickTooShortError extends DomainError {
  constructor(nick: string) {
    super('Nick is too short', { nick });
  }
}

export class Nick extends ValueObject<string> {
  get value() {
    return this.val;
  }

  static create(value: string) {
    if (value.length < 3) {
      throw new NickTooShortError(value);
    }

    return new Nick(value);
  }
}
