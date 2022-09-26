import { AuthorizationErrorReason } from 'shared';

import { ExecutionContext } from '../utils';

import { AuthorizationError } from './authorization-error';
import { Authorizer } from './authorizer';

export class IsAuthenticated implements Authorizer {
  async authorize(ctx: ExecutionContext): Promise<void> {
    if (ctx.user === undefined) {
      throw new AuthorizationError(AuthorizationErrorReason.unauthenticated);
    }
  }
}

export class IsNotAuthenticated implements Authorizer {
  async authorize(ctx: ExecutionContext): Promise<void> {
    if (ctx.user !== undefined) {
      throw new AuthorizationError(AuthorizationErrorReason.authenticated);
    }
  }
}
