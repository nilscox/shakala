import { Command, CommandHandler } from '../../cqs/command-handler';
import { UserRepository } from '../../interfaces/repositories';

export class ValidateEmailAddressCommand implements Command {
  constructor(public readonly userId: string, public readonly token: string) {}
}

export class ValidateEmailAddressHandler implements CommandHandler<ValidateEmailAddressCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(command: ValidateEmailAddressCommand): Promise<void> {
    const { userId, token } = command;

    const user = await this.userRepository.findByIdOrFail(userId);

    user.validateEmailAddress(token);

    await this.userRepository.save(user);
  }
}
