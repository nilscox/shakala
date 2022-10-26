import { mockResolve } from 'shared/test';

import { createNotification, TestStore } from '../../../test';
import { setNotifications } from '../fetch-notifications/fetch-notifications';

import { markNotificationAsSeen } from './mark-notification-as-seen';

describe('markNotificationAsSeen', () => {
  const store = new TestStore();

  it('marks a notification as seen', async () => {
    const notification = createNotification();

    store.dispatch(setNotifications({ page: 1 }, [notification]));
    store.userGateway.markNotificationAsSeen = mockResolve();

    await store.dispatch(markNotificationAsSeen(notification.id));

    expect(store.userGateway.markNotificationAsSeen).toHaveBeenCalledWith(notification.id);
  });
});
