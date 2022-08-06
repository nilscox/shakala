export class PayloadError extends Error {
  constructor(message: string, readonly payload?: unknown) {
    super(message);
  }
}
