import { CommandHandler, CryptoPort, EventPublisher } from '@shakala/common';
import { DomainEvent } from '@shakala/common/src/ddd/domain-event';

import { Nick } from '../../entities/nick.value-object';
import { User } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';

type CreateUserDependencies = {
  crypto: CryptoPort;
  publisher: EventPublisher;
  userRepository: UserRepository;
};

type CreateUserCommand = {
  id: string;
  nick: string;
  email: string;
  password: string;
};

export const createUser: CommandHandler<CreateUserDependencies, CreateUserCommand> = async (
  { crypto, publisher, userRepository },
  command
) => {
  const user = new User({
    id: command.id,
    nick: new Nick(command.nick),
    email: command.email,
    hashedPassword: await crypto.hash(command.password),
  });

  await userRepository.save(user);

  publisher.publish(new UserCreatedEvent(user.id));
};

export class UserCreatedEvent extends DomainEvent {
  constructor(id: string) {
    super('User', id);
  }
}
