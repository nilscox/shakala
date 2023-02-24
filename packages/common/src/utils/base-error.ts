export abstract class BaseError<Details = never> extends Error {
  public readonly code: string;
  public readonly details: Details;
  public status?: number;

  constructor(message: string, ...details: Details extends never ? [] : [Details]) {
    super(message);

    this.code = new.target.name;
    this.details = details[0] as Details;

    // https://github.com/microsoft/TypeScript/issues/13965
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.code;
  }

  serialize() {
    return {
      code: this.code,
      message: this.message,
      ...(this.details ? { details: this.details } : undefined),
    };
  }
}
