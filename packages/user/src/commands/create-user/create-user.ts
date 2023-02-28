import {
  commandCreator,
  CommandHandler,
  CryptoPort,
  DomainEvent,
  EventPublisher,
  GeneratorPort,
  TOKENS,
} from '@shakala/common';
import { injected } from 'brandi';

import { Nick } from '../../entities/nick.value-object';
import { User } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';
import { USER_TOKENS } from '../../tokens';

export type CreateUserCommand = {
  id: string;
  nick: string;
  email: string;
  password: string;
};

const symbol = Symbol('CreateUserCommand');
export const createUser = commandCreator<CreateUserCommand>(symbol);

export class CreateUserHandler implements CommandHandler<CreateUserCommand> {
  symbol = symbol;

  constructor(
    private readonly generator: GeneratorPort,
    private readonly crypto: CryptoPort,
    private readonly publisher: EventPublisher,
    private readonly userRepository: UserRepository
  ) {}

  async handle(command: CreateUserCommand): Promise<void> {
    const user = new User({
      id: command.id,
      nick: new Nick(command.nick),
      email: command.email,
      hashedPassword: await this.crypto.hash(command.password),
      emailValidationToken: await this.generator.generateToken(),
    });

    await this.userRepository.save(user);

    this.publisher.publish(new UserCreatedEvent(user.id));
  }
}

injected(CreateUserHandler, TOKENS.generator, TOKENS.crypto, TOKENS.publisher, USER_TOKENS.userRepository);

export class UserCreatedEvent extends DomainEvent {
  constructor(id: string) {
    super('User', id);
  }
}
