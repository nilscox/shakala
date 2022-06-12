export class ValueObject<Value> {
  protected val: Value;

  protected constructor(value: Value) {
    this.val = value;
  }

  equals(other: ValueObject<Value>) {
    return JSON.stringify(this.val) === JSON.stringify(other.val);
  }
}
