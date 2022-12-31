import { NickTooShortError } from '@shakala/shared';

import { ValueObject } from '../ddd/value-object';

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
