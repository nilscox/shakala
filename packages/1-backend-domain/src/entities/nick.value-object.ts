import { ValueObject } from '../ddd/value-object';

import { DomainError } from './domain-error';

export const NickTooShortError = DomainError.extend(
  'nick is too short',
  (nick: string, minLength: number) => ({ nick, minLength }),
);

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
