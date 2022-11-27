import { AuthorizationErrorReason, get, HttpErrorBody } from 'shared';

export class AuthorizationError extends Error {
  constructor(public readonly reason: AuthorizationErrorReason | string) {
    super('AuthorizationError');
  }

  static from(error: HttpErrorBody) {
    const reason = get(error, 'details', 'reason');

    if (typeof reason === 'string') {
      return new AuthorizationError(reason);
    }

    return new AuthorizationError('unknown');
  }
}
