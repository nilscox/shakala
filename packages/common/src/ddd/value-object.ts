export abstract class ValueObject<Value = unknown> {
  constructor(protected value: Value) {}

  equals(other: ValueObject<Value>) {
    return JSON.stringify(this.value) === JSON.stringify(other.value);
  }
}
