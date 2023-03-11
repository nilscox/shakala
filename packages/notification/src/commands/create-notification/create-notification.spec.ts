import { expect, StubDateAdapter, StubGeneratorAdapter, Timestamp } from '@shakala/common';
import { beforeEach, describe, it } from 'vitest';

import { NotificationType } from '../../entities/notification.entity';
import { InMemoryNotificationRepository } from '../../repositories/in-memory-notification.repository';

import { CreateNotificationHandler } from './create-notification';

describe('CreateNotificationCommand', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  it('creates a notification', async () => {
    await test.act();

    const notification = test.getNotification();

    expect(notification).toBeDefined();
    expect(notification).toHaveProperty('id', 'notificationId');
    expect(notification).toHaveProperty('date', test.now);
    expect(notification).toHaveProperty('userId', 'userId');
    expect(notification).toHaveProperty('seenDate', undefined);
    expect(notification).toHaveProperty('type', NotificationType.rulesUpdated);
    expect(notification).toHaveProperty('payload', { version: '4.2', changes: 'great stuff' });
  });
});

class Test {
  now = new Timestamp('2022-01-01');

  generator = new StubGeneratorAdapter();
  dateAdapter = new StubDateAdapter(this.now);
  notificationRepository = new InMemoryNotificationRepository();

  handler = new CreateNotificationHandler(this.generator, this.dateAdapter, this.notificationRepository);

  constructor() {
    this.generator.nextId = 'notificationId';
  }

  getNotification() {
    return this.notificationRepository.get('notificationId');
  }

  async act() {
    await this.handler.handle({
      type: NotificationType.rulesUpdated,
      userId: 'userId',
      payload: {
        version: '4.2',
        changes: 'great stuff',
      },
    });
  }
}
