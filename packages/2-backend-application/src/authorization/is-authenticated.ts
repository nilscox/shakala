import { ExecutionContext } from '../utils/execution-context';

import { AuthorizationError } from './authorization-error';
import { Authorizer } from './authorizer';

export class UnauthenticatedError extends AuthorizationError {
  constructor() {
    super('unauthenticated');
  }
}

export class IsAuthenticated implements Authorizer {
  async authorize(ctx: ExecutionContext): Promise<void> {
    if (ctx.user === undefined) {
      throw new UnauthenticatedError();
    }
  }
}
