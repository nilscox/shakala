import { CryptoService, DateService, Nick, User, DomainError } from 'backend-domain';
import { GeneratorService } from 'backend-domain';

import { Command, CommandHandler } from '../cqs/command-handler';
import { UserRepository } from '../interfaces/user.repository';

export class EmailAlreadyExistsError extends DomainError<{ email: string }> {
  constructor(email: string) {
    super('EmailAlreadyExists', { email });
  }
}

export class NickAlreadyExistsError extends DomainError<{ nick: string }> {
  constructor(nick: string) {
    super('NickAlreadyExists', { nick });
  }
}

export class SignupCommand implements Command {
  constructor(readonly nick: string, readonly email: string, readonly password: string) {}
}

export class SignupCommandHandler implements CommandHandler<SignupCommand, string> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly generatorService: GeneratorService,
    private readonly cryptoService: CryptoService,
    private readonly dateService: DateService,
  ) {}

  async handle(command: SignupCommand): Promise<string> {
    const { nick, email, password } = command;

    await this.assertEmailDontExist(email);
    await this.assertNickDontExist(nick);

    const user = await User.createNew(this.cryptoService, this.dateService, {
      id: await this.generatorService.generateId(),
      nick,
      email,
      password,
    });

    await this.userRepository.save(user);

    return user.id;
  }

  private async assertEmailDontExist(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      throw new EmailAlreadyExistsError(email);
    }
  }

  private async assertNickDontExist(nick: string) {
    const user = await this.userRepository.findByNick(new Nick(nick));

    if (user) {
      throw new NickAlreadyExistsError(nick);
    }
  }
}
