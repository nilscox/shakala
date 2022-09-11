import { InvalidCredentialsError } from 'backend-domain';

import { Command, CommandHandler } from '../../cqs/command-handler';
import { UserRepository } from '../../interfaces/repositories';

export class LoginCommand implements Command {
  constructor(readonly email: string, readonly password: string) {}
}

export class LoginCommandHandler implements CommandHandler<LoginCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(command: LoginCommand): Promise<void> {
    const user = await this.userRepository.findByEmail(command.email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    await user.authenticate(command.password);

    await this.userRepository.save(user);
  }
}
