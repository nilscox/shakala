import { Command, CommandHandler, IEventBus } from '../../../cqs';
import { UserRepository } from '../../../interfaces';
import { EventPublisher, ExecutionContext } from '../../../utils';

export class ValidateEmailAddressCommand implements Command {
  constructor(public readonly userId: string, public readonly token: string) {}
}

export class ValidateEmailAddressHandler implements CommandHandler<ValidateEmailAddressCommand> {
  constructor(private readonly eventBus: IEventBus, private readonly userRepository: UserRepository) {}

  async handle(command: ValidateEmailAddressCommand, ctx: ExecutionContext): Promise<void> {
    const { userId, token } = command;

    const user = await this.userRepository.findByIdOrFail(userId);

    const publisher = new EventPublisher(ctx, user);

    user.validateEmailAddress(token);

    await this.userRepository.save(user);
    publisher.publish(this.eventBus);
  }
}
