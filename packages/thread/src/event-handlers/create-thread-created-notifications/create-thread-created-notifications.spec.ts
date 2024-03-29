import expect from '@nilscox/expect';
import { StubCommandBus, StubQueryBus } from '@shakala/common';
import { createNotification } from '@shakala/notification';
import { NotificationPayloadMap, NotificationType } from '@shakala/shared';
import { getUser, listUsers } from '@shakala/user';
import { beforeEach, describe, it } from 'vitest';

import { ThreadCreatedEvent } from '../../commands/create-thread/create-thread';
import { create } from '../../factories';
import { InMemoryThreadRepository } from '../../repositories/thread/in-memory-thread.repository';

import { CreateThreadCreatedNotificationsHandler } from './create-thread-created-notifications';

describe('CreateThreadCreatedNotificationsHandler', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  it('creates a notification for all users when a ThreadCreatedEvent is emitted', async () => {
    await test.act();

    const payload: NotificationPayloadMap[NotificationType.threadCreated] = {
      threadId: 'threadId',
      author: {
        id: 'authorId',
        nick: 'author',
      },
      description: 'description',
    };

    expect(test.commandBus).toInclude(
      createNotification({ type: NotificationType.threadCreated, userId: 'userId', payload })
    );
  });
});

class Test {
  readonly thread = create.thread({
    id: 'threadId',
    authorId: 'authorId',
    description: 'description',
  });

  readonly threadRepository = new InMemoryThreadRepository([this.thread]);
  readonly commandBus = new StubCommandBus();
  readonly queryBus = new StubQueryBus();

  private handler = new CreateThreadCreatedNotificationsHandler(
    this.commandBus,
    this.queryBus,
    this.threadRepository
  );

  constructor() {
    this.queryBus.on(getUser({ id: 'authorId' })).return({
      id: 'authorId',
      email: 'author@domain.tld',
      emailValidated: true,
      nick: 'author',
    });

    this.queryBus.on(listUsers({})).return([{ id: 'userId' }]);
  }

  async act() {
    await this.handler.handle(new ThreadCreatedEvent('threadId'));
  }
}
