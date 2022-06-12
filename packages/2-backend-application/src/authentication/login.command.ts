import { CryptoService, DateService, DomainError } from 'backend-domain';

import { Command, CommandHandler } from '../cqs/command-handler';
import { UserRepository } from '../interfaces/user.repository';

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('InvalidCredentials', undefined);
  }
}

export class LoginCommand implements Command {
  constructor(readonly email: string, readonly password: string) {}
}

export class LoginCommandHandler implements CommandHandler<LoginCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptoService: CryptoService,
    private readonly dateService: DateService,
  ) {}

  async handle(command: LoginCommand): Promise<void> {
    const user = await this.userRepository.findByEmail(command.email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    if (!(await user.checkPassword(this.cryptoService, command.password))) {
      throw new InvalidCredentialsError();
    }

    user.login(this.dateService);

    await this.userRepository.save(user);
  }
}
