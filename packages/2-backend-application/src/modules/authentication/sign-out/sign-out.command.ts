import { Authorize, IsAuthenticated } from '../../../authorization';
import { Command, CommandHandler, IEventBus } from '../../../cqs';
import { AuthenticatedExecutionContext, EventPublisher } from '../../../utils';

export class SignOutCommand implements Command {
  constructor() {}
}

@Authorize(IsAuthenticated)
export class SignOutCommandHandler implements CommandHandler<SignOutCommand, void> {
  constructor(private readonly eventBus: IEventBus) {}

  async handle(_command: SignOutCommand, ctx: AuthenticatedExecutionContext): Promise<void> {
    const { user } = ctx;

    const publisher = new EventPublisher(ctx, user);

    user.signOut();

    publisher.publish(this.eventBus);
  }
}
