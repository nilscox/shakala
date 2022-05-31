import { ValueObject } from '../ddd/value-object';

export class Markdown extends ValueObject<string> {
  static create(value: string) {
    return new Markdown(value);
  }

  get value() {
    return this.val;
  }

  match(search: string) {
    return this.value.includes(search);
  }
}
