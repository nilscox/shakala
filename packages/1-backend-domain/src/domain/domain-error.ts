export class DomainError<Details = undefined> extends Error {
  constructor(message: string, public readonly details: Details) {
    super(message);
  }
}
