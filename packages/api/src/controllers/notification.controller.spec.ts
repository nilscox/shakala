import expect from '@nilscox/expect';
import { getNotificationsCount, listUserNotifications, markNotificationAsSeen } from '@shakala/notification';
import { NotificationType } from '@shakala/shared';
import { beforeEach, describe, it } from 'vitest';

import { createControllerTest, ControllerTest } from '../tests/controller-test';

describe('[intg] NotificationController', () => {
  const getTest = createControllerTest(Test);
  let test: Test;

  beforeEach(async () => {
    test = await getTest();
  });

  describe('GET /notification/count', () => {
    const route = '/notification/count';

    it("retrieves the user's number of unseen notifications", async () => {
      test.queryBus.on(getNotificationsCount({ userId: 'userId', unseen: true })).return(42);

      const response = await expect(test.asUser.get(route)).toHaveStatus(200);
      const body = await response.json();

      expect(body).toEqual(42);
    });

    it('fails with status 401 when the user is not authenticated', async () => {
      await expect(test.createAgent().get(route)).toHaveStatus(401);
    });
  });

  describe('GET /notification', () => {
    const route = '/notification';

    it("retrieves the list of user's notifications", async () => {
      test.queryBus.on(listUserNotifications({ userId: 'userId', pageSize: 10, page: 1 })).return({
        total: 1,
        items: [
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
        ],
      });

      const response = await expect(test.asUser.get(route)).toHaveStatus(200);
      const body = await response.json();

      expect<object>(body).toHaveProperty('0.id', 'notificationId');
      expect(response.headers.get('pagination-total')).toEqual('1');
    });

    it('retrieves the notifications on the second page', async () => {
      test.queryBus
        .on(listUserNotifications({ userId: 'userId', pageSize: 1, page: 2 }))
        .return({ total: 0, items: [] });

      const searchParams = new URLSearchParams({
        pageSize: '1',
        page: '2',
      });

      await expect(test.asUser.get(`${route}?${searchParams}`)).toHaveStatus(200);
    });

    it('fails with status 401 when the user is not authenticated', async () => {
      await expect(test.createAgent().get(route)).toHaveStatus(401);
    });
  });

  describe('PUT /notification/:notificationId/seen', () => {
    const route = '/notification/notificationId/seen';

    it('invokes the markNotificationAsSeen command', async () => {
      await expect(test.asUser.put(route)).toHaveStatus(204);

      expect(test.commandBus).toInclude(
        markNotificationAsSeen({
          notificationId: 'notificationId',
        })
      );
    });

    it('fails with status 401 when the user is not authenticated', async () => {
      await expect(test.createAgent().put(route)).toHaveStatus(401);
    });
  });
});

class Test extends ControllerTest {
  asUser = this.as('userId');

  arrange() {
    this.createUser({ id: 'userId' });
  }
}
