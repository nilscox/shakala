import {
  commandCreator,
  CommandHandler,
  DomainEvent,
  EventPublisher,
  registerCommand,
  TOKENS,
} from '@shakala/common';
import { injected } from 'brandi';

import { Nick } from '../../entities/nick.value-object';
import { User } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user/user.repository';
import { USER_TOKENS } from '../../tokens';

export type UpdateUserProfileCommand = {
  userId: string;
  nick?: string;
};

export const updateUserProfile = commandCreator<UpdateUserProfileCommand>('updateUserProfile');

export class UpdateUserProfileHandler implements CommandHandler<UpdateUserProfileCommand> {
  constructor(private readonly publisher: EventPublisher, private readonly userRepository: UserRepository) {}

  async handle(command: UpdateUserProfileCommand): Promise<void> {
    const user = await this.userRepository.findByIdOrFail(command.userId);
    const publisher = this.publisher.begin();

    if (command.nick) {
      const old = user.nick;

      user.nick = new Nick(command.nick);
      publisher.addEvent(new UserNickChangedEvent(user, old.toString()));
    }

    await this.userRepository.save(user);
    publisher.commit();
  }
}

injected(UpdateUserProfileHandler, TOKENS.publisher, USER_TOKENS.repositories.userRepository);
registerCommand(updateUserProfile, USER_TOKENS.commands.updateUserProfileHandler);

export class UserNickChangedEvent extends DomainEvent<{ oldValue: string; newValue: string }> {
  constructor(user: User, oldValue: string) {
    super('User', user.id, { oldValue, newValue: user.nick.toString() });
  }
}
