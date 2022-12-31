import { Notification, StubDateAdapter, Timestamp } from '@shakala/backend-domain';
import { NotificationType } from '@shakala/shared';

import { InMemoryNotificationRepository } from '../../../adapters/in-memory-repositories/notification.in-memory-repository';

import { MarkNotificationAsSeenCommand, MarkNotificationAsSeenHandler } from './mark-notification-as-seen';

describe('MarkNotificationAsSeenCommand', () => {
  const dateAdapter = new StubDateAdapter();
  const notificationRepository = new InMemoryNotificationRepository();

  const handler = new MarkNotificationAsSeenHandler(dateAdapter, notificationRepository);

  const notificationId = 'notificationId';
  const userId = 'userId';
  const now = new Timestamp('2022-01-01');

  beforeEach(() => {
    dateAdapter.setNow(now);
  });

  it('marks a notification as seen', async () => {
    const notification = Notification.create(NotificationType.rulesUpdated, {
      id: notificationId,
      userId,
      date: now,
      payload: { version: '', changes: '' },
    });

    notificationRepository.add(notification);

    await handler.handle(new MarkNotificationAsSeenCommand(notificationId));

    expect(notificationRepository.get(notificationId)).toHaveProperty('seenDate', now);
  });

  // todo: it fails when the notification was already marked as seen
});
