export class ValueObject<Value> {
  constructor(protected value: Value) {}

  equals(other: ValueObject<Value>) {
    return JSON.stringify(this.value) === JSON.stringify(other.value);
  }
}
