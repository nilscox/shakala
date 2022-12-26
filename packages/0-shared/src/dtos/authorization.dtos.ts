import { BaseError } from '../libs';

export enum AuthorizationErrorReason {
  unauthenticated = 'unauthenticated',
  authenticated = 'authenticated',
  emailValidationRequired = 'emailValidationRequired',
  isReadOnly = 'isReadOnly',
}

export class AuthorizationError extends BaseError<{ reason: AuthorizationErrorReason }> {
  status = 403;

  constructor(reason: AuthorizationErrorReason) {
    super('authorization error', { reason });
  }
}
