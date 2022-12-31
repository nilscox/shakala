import { User } from '@shakala/backend-domain';

export class ExecutionContext {
  constructor(public readonly user: User | undefined) {}

  static get unauthenticated() {
    return new ExecutionContext(undefined);
  }

  static as(user: User) {
    return new ExecutionContext(user) as AuthenticatedExecutionContext;
  }
}

export class AuthenticatedExecutionContext extends ExecutionContext {
  constructor(public override readonly user: User) {
    super(user);
  }
}
