import { expect, StubDateAdapter, StubEventPublisher, Timestamp } from '@shakala/common';
import { beforeEach, describe, it } from 'vitest';

import { create } from '../../factories';
import { InMemoryNotificationRepository } from '../../repositories/in-memory-notification.repository';

import {
  MarkNotificationAsSeenHandler,
  NotificationAlreadySeen,
  NotificationMarkedAsSeenEvent,
} from './mark-notification-as-seen';

describe('MarkNotificationAsSeenCommand', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  it('marks a notification as seen', async () => {
    await test.act();

    const notification = test.getNotification();

    expect(notification).toBeDefined();
    expect(notification).toHaveProperty('seenDate', test.now);
  });

  it('emits a NotificationMarkedAsSeenEvent', async () => {
    await test.act();

    expect(test.publisher).toHavePublished(new NotificationMarkedAsSeenEvent('notificationId'));
  });

  it('throws a NotificationAlreadySeen when already marked as seen', async () => {
    test.notification.setSeenDate(test.now);
    test.notificationRepository.add(test.notification);

    await expect(test.act()).toRejectWith(NotificationAlreadySeen);
  });
});

class Test {
  now = new Timestamp('2022-01-01');

  notification = create.notification({ id: 'notificationId', seenDate: undefined });

  dateAdapter = new StubDateAdapter(this.now);
  publisher = new StubEventPublisher();
  notificationRepository = new InMemoryNotificationRepository([this.notification]);

  handler = new MarkNotificationAsSeenHandler(this.dateAdapter, this.publisher, this.notificationRepository);

  getNotification() {
    return this.notificationRepository.get('notificationId');
  }

  async act() {
    await this.handler.handle({
      notificationId: 'notificationId',
    });
  }
}
