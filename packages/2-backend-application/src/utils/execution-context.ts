import { User } from 'backend-domain';

export class ExecutionContext {
  constructor(public readonly user: User | undefined) {}

  static get unauthenticated() {
    return new ExecutionContext(undefined);
  }
}

export class AuthenticatedExecutionContext extends ExecutionContext {
  constructor(public override readonly user: User) {
    super(user);
  }
}
