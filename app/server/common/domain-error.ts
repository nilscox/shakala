export class DomainError extends Error {
  constructor(message: string, public readonly details?: Record<string, unknown>) {
    super(message);
  }
}
