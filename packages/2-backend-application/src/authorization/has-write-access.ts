import { AuthorizationError, AuthorizationErrorReason, UnexpectedError } from '@shakala/shared';

import { ExecutionContext } from '../utils';

import { Authorizer } from './authorizer';

export class HasWriteAccess implements Authorizer {
  async authorize({ user }: ExecutionContext): Promise<void> {
    if (user === undefined) {
      throw new UnexpectedError('HasWriteAccess: user is not defined');
    }

    if (!user.isEmailValidated) {
      throw new AuthorizationError(AuthorizationErrorReason.emailValidationRequired);
    }

    if (!user.hasWriteAccess) {
      throw new AuthorizationError(AuthorizationErrorReason.isReadOnly);
    }
  }
}
