import assert from 'assert';

import { CommandBus, EventHandler, QueryBus, registerEventHandler, TOKENS } from '@shakala/common';
import { createNotification } from '@shakala/notification';
import { NotificationPayloadMap, NotificationType } from '@shakala/shared';
import { getUser, listUsers } from '@shakala/user';
import { injected } from 'brandi';

import { ThreadCreatedEvent } from '../../commands/create-thread/create-thread';
import { ThreadRepository } from '../../repositories/thread/thread.repository';
import { THREAD_TOKENS } from '../../tokens';

export class CreateThreadCreatedNotificationsHandler implements EventHandler<ThreadCreatedEvent> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly threadRepository: ThreadRepository
  ) {}

  async handle(event: ThreadCreatedEvent): Promise<void> {
    const thread = await this.threadRepository.findByIdOrFail(event.id);
    const author = await this.queryBus.execute(getUser({ id: thread.authorId }));

    assert(author, 'expected thread author to exist');

    await this.createNotifications({
      threadId: thread.id,
      author: {
        id: author.id,
        nick: author.nick,
        profileImage: author.profileImage,
      },
      description: thread.description,
    });
  }

  private async createNotifications(payload: NotificationPayloadMap[NotificationType.threadCreated]) {
    const users = await this.queryBus.execute(listUsers({}));

    for (const user of users) {
      await this.commandBus.execute(
        createNotification({
          type: NotificationType.threadCreated,
          userId: user.id,
          payload: payload,
        })
      );
    }
  }
}

injected(
  CreateThreadCreatedNotificationsHandler,
  TOKENS.commandBus,
  TOKENS.queryBus,
  THREAD_TOKENS.repositories.threadRepository
);

registerEventHandler(ThreadCreatedEvent, THREAD_TOKENS.eventHandlers.createThreadCreatedNotificationsHandler);
