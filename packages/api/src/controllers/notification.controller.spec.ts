import { listUserNotifications, NotificationType } from '@shakala/notification';
import { afterEach, beforeEach, describe, it } from 'vitest';

import { expect } from '../tests/expect';
import { IntegrationTest } from '../tests/integration-test';

describe('[intg] NotificationController', () => {
  let test: Test;

  beforeEach(async () => {
    test = new Test();
    await test.setup?.();
  });

  afterEach(() => test?.cleanup());

  describe('GET /notification', () => {
    const route = '/notification';

    it('invokes the listUserNotifications query', async () => {
      test.queryBus.on(listUserNotifications({ userId: 'userId' })).return([
        {
          id: 'notificationId',
          type: NotificationType.rulesUpdated,
          created: new Date().toISOString(),
          seen: false,
          payload: {
            version: '6.8',
            changes: 'more bugs',
          },
        },
      ]);

      const response = await expect(test.asUser.get(route)).toHaveStatus(200);
      const body = await response.json();

      expect<object>(body).toHaveProperty('0.id', 'notificationId');
    });

    it('fails with status 401 when the user is not authenticated', async () => {
      await expect(test.createAgent().get(route)).toHaveStatus(401);
    });
  });
});

class Test extends IntegrationTest {
  asUser = this.as('userId');

  arrange() {
    this.user = { id: 'userId' };
  }
}
