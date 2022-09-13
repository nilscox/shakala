export class AuthorizationError extends Error {
  constructor(public readonly reason: string) {
    super('AuthorizationError');
  }
}
