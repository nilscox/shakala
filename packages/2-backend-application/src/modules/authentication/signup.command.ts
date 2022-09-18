import { CryptoService, DateService, DomainError, GeneratorService, Nick, User } from 'backend-domain';

import { Authorize, IsNotAuthenticated } from '../../authorization';
import { Command, CommandHandler } from '../../cqs/command-handler';
import { IEventBus } from '../../cqs/event-bus';
import { UserRepository } from '../../interfaces/repositories';
import { EventPublisher } from '../../utils/event-publisher';
import { ExecutionContext } from '../../utils/execution-context';

const emailAlreadyExistsDetails = (email: string) => ({ email });
export const EmailAlreadyExistsError = DomainError.extend('email already exists', emailAlreadyExistsDetails);

const nickAlreadyExistsDetails = (nick: string) => ({ nick });
export const NickAlreadyExistsError = DomainError.extend('nick already exists', nickAlreadyExistsDetails);

export class SignupCommand implements Command {
  constructor(readonly nick: string, readonly email: string, readonly password: string) {}
}

@Authorize(IsNotAuthenticated)
export class SignupCommandHandler implements CommandHandler<SignupCommand, string> {
  constructor(
    private readonly eventBus: IEventBus,
    private readonly userRepository: UserRepository,
    private readonly generatorService: GeneratorService,
    private readonly cryptoService: CryptoService,
    private readonly dateService: DateService,
  ) {}

  async handle(command: SignupCommand, ctx: ExecutionContext): Promise<string> {
    const { nick, email, password } = command;

    await this.assertEmailDontExist(email);
    await this.assertNickDontExist(nick);

    const user = await User.create(
      {
        nick,
        email,
        password,
      },
      this.generatorService,
      this.dateService,
      this.cryptoService,
    );

    const publisher = new EventPublisher(ctx, user);

    await this.userRepository.save(user);
    publisher.publish(this.eventBus);

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
