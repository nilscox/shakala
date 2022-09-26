import { InvalidCredentials } from 'backend-domain';

import { Authorize, IsNotAuthenticated } from '../../../authorization';
import { Command, CommandHandler } from '../../../cqs';
import { UserRepository } from '../../../interfaces';

export class LoginCommand implements Command {
  constructor(readonly email: string, readonly password: string) {}
}

@Authorize(IsNotAuthenticated)
export class LoginCommandHandler implements CommandHandler<LoginCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(command: LoginCommand): Promise<void> {
    const user = await this.userRepository.findByEmail(command.email);

    if (!user) {
      throw new InvalidCredentials();
    }

    await user.authenticate(command.password);

    await this.userRepository.save(user);
  }
}
