export interface ExtendedError<Args extends unknown[] = [], Details = undefined> {
  new (...args: Args): BaseError<Details>;
}

// prettier-ignore
export abstract class BaseError<Details = undefined> extends Error {
  constructor(message: string) {
    super(message);
  }

  public abstract readonly details: Details;

  static extend(message: string): ExtendedError;
  static extend<Details, Args extends unknown[]>(message: string, getDetails: (...args: Args) => Details): ExtendedError<Args, Details>;

  static extend<Details, Args extends unknown[]>(message: string, getDetails?: (...args: Args) => Details): ExtendedError<Args, Details> {
    return class extends this<Details> {
      public readonly details: Details;

      constructor(...args: Args) {
        super(message);
        this.details = getDetails?.(...args) as Details;
      }
    };
  }
}
