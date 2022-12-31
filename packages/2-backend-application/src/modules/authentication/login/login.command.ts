import { InvalidCredentials } from '@shakala/shared';

import { Authorize, IsNotAuthenticated } from '../../../authorization';
import { Command, CommandHandler, IEventBus } from '../../../cqs';
import { UserRepository } from '../../../interfaces';
import { EventPublisher, ExecutionContext } from '../../../utils';

export class LoginCommand implements Command {
  constructor(readonly email: string, readonly password: string) {}
}

@Authorize(IsNotAuthenticated)
export class LoginCommandHandler implements CommandHandler<LoginCommand> {
  constructor(private readonly eventBus: IEventBus, private readonly userRepository: UserRepository) {}

  async handle(command: LoginCommand, ctx: ExecutionContext): Promise<void> {
    const user = await this.userRepository.findByEmail(command.email);

    if (!user) {
      throw new InvalidCredentials();
    }

    const publisher = new EventPublisher(ctx, user);

    try {
      await user.authenticate(command.password);
    } catch (error) {
      if (error instanceof InvalidCredentials) {
        publisher.publish(this.eventBus);
      }

      throw error;
    }

    await this.userRepository.save(user);
    publisher.publish(this.eventBus);
  }
}
