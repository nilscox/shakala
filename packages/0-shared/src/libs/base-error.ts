export interface ExtendedError<Args extends unknown[] = [], Details = undefined> {
  new (...args: Args): BaseError<Details>;
}

export abstract class BaseError<Details = undefined> extends Error {
  public abstract readonly details: Details;

  static extend(message: string): ExtendedError;

  static extend<Details, Args extends unknown[]>(
    message: string,
    getDetails: (...args: Args) => Details,
  ): ExtendedError<Args, Details>;

  static extend<Details, Args extends unknown[]>(
    message: string,
    getDetails?: (...args: Args) => Details,
  ): ExtendedError<Args, Details> {
    return class ExtendedError extends this<Details> {
      public readonly details: Details;

      constructor(...args: Args) {
        super(message);

        this.details = getDetails?.(...args) as Details;

        // https://github.com/microsoft/TypeScript/issues/13965
        Object.setPrototypeOf(this, ExtendedError.prototype);
      }
    };
  }
}
