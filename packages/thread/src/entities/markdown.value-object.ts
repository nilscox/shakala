import { ValueObject } from '@shakala/common';

export class Markdown extends ValueObject<string> {
  override toString() {
    return this.value;
  }

  match(search: string) {
    return this.value.includes(search);
  }
}
