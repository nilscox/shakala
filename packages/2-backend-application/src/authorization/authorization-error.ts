import { AuthorizationErrorReason, BaseError } from 'shared';

export const AuthorizationError = BaseError.extend(
  'authorization error',
  (reason: AuthorizationErrorReason) => ({ reason }),
);
