import { ExecutionContext } from '../utils/execution-context';

import { AuthorizationError } from './authorization-error';
import { Authorizer } from './authorizer';

enum WriteAccessErrorReason {
  emailNotValidated = 'EmailNotValidated',
}

class WriteAccessError extends AuthorizationError {
  constructor(reason: WriteAccessErrorReason) {
    super(reason);
  }
}

export class HasWriteAccess implements Authorizer {
  async authorize({ user }: ExecutionContext): Promise<void> {
    if (user === undefined) {
      throw new Error('HasWriteAccess: user is not defined');
    }

    if (!user.isEmailValidated) {
      throw new WriteAccessError(WriteAccessErrorReason.emailNotValidated);
    }
  }
}
