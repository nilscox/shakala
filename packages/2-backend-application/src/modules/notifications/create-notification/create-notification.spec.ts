import { Notification, StubDateAdapter, StubGeneratorAdapter, Timestamp } from '@shakala/backend-domain';
import { NotificationType } from '@shakala/shared';

import { InMemoryNotificationRepository } from '../../../adapters/in-memory-repositories/notification.in-memory-repository';

import { CreateNotificationCommand, CreateNotificationHandler } from './create-notification';

describe('CreateNotificationCommand', () => {
  const generator = new StubGeneratorAdapter();
  const dateAdapter = new StubDateAdapter();
  const notificationRepository = new InMemoryNotificationRepository();

  const handler = new CreateNotificationHandler(generator, dateAdapter, notificationRepository);

  const notificationId = 'notificationId';
  const userId = 'userId';
  const now = new Timestamp('2022-01-01');

  beforeEach(() => {
    generator.nextId = notificationId;
    dateAdapter.setNow(now);
  });

  it('creates a notification', async () => {
    await handler.handle(
      new CreateNotificationCommand(userId, NotificationType.rulesUpdated, {
        version: '4.2',
        changes: 'great stuff',
      }),
    );

    expect(notificationRepository.get(notificationId)).toEqual(
      new Notification({
        id: notificationId,
        date: now,
        userId,
        seenDate: undefined,
        type: NotificationType.rulesUpdated,
        payload: { version: '4.2', changes: 'great stuff' },
      }),
    );
  });
});
