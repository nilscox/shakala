import { CryptoPort, DatePort, GeneratorPort, Nick, ProfileImageStorePort, User } from '@shakala/backend-domain';
import { EmailAlreadyExistsError, NickAlreadyExistsError } from '@shakala/shared';

import { Authorize, IsNotAuthenticated } from '../../../authorization';
import { Command, CommandHandler, IEventBus } from '../../../cqs';
import { UserRepository } from '../../../interfaces';
import { EventPublisher, ExecutionContext } from '../../../utils';

export class SignupCommand implements Command {
  constructor(readonly nick: string, readonly email: string, readonly password: string) {}
}

@Authorize(IsNotAuthenticated)
export class SignupCommandHandler implements CommandHandler<SignupCommand, string> {
  constructor(
    private readonly eventBus: IEventBus,
    private readonly userRepository: UserRepository,
    private readonly generator: GeneratorPort,
    private readonly crypto: CryptoPort,
    private readonly dateAdapter: DatePort,
    private readonly profileImageStore: ProfileImageStorePort,
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
      this.generator,
      this.dateAdapter,
      this.crypto,
      this.profileImageStore,
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
