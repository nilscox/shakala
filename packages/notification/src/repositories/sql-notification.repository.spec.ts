import expect from '@nilscox/expect';
import { Pagination } from '@shakala/common';
import { createRepositoryTest, RepositoryTest } from '@shakala/persistence/test';
import { beforeEach, describe, it } from 'vitest';

import { create } from '../factories';

import { SqlNotificationRepository } from './sql-notification.repository';

describe('SqlNotificationRepository', () => {
  const getTest = createRepositoryTest(Test);
  let test: Test;

  beforeEach(async () => {
    test = await getTest();
  });

  it('persists a notification', async () => {
    const user = await test.create.user();
    const notification = create.notification({ userId: user.id });

    await test.repository.save(notification);
    await expect(test.repository.findById(notification.id)).toResolve(notification);
  });

  it('retrieves the total number of notifications for a given user', async () => {
    const user = await test.create.user();
    await test.create.notification({ user, seenAt: null });
    await test.create.notification({ user, seenAt: new Date() });

    await expect(test.repository.getNotificationsCount(user.id, false)).toResolve(2);
  });

  it('retrieves the number of unseen notifications for a given user', async () => {
    const user = await test.create.user();
    await test.create.notification({ user, seenAt: null });
    await test.create.notification({ user, seenAt: new Date() });

    await expect(test.repository.getNotificationsCount(user.id, true)).toResolve(1);
  });

  it('retrieves the list of notifications for a given user', async () => {
    const user = await test.create.user();
    const notification = await test.create.notification({ user });

    await expect(test.repository.getUserNotifications(user.id, Pagination.firstPage())).toResolve({
      items: [expect.objectWith({ id: notification.id })],
      total: 1,
    });
  });
});

class Test extends RepositoryTest {
  get repository() {
    return new SqlNotificationRepository(this.database);
  }
}
