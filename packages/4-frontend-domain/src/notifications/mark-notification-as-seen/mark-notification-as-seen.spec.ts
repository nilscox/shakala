import { mockResolve } from 'shared/test';

import { createNotification, TestStore } from '../../test';
import { addNotifications, setNotifications } from '../notifications.actions';
import { selectNotification } from '../notifications.selectors';

import { markNotificationAsSeen } from './mark-notification-as-seen';

describe('markNotificationAsSeen', () => {
  const store = new TestStore();

  it('calls the gateway', async () => {
    const notification = createNotification();

    store.dispatch(setNotifications([notification]));
    store.dispatch(addNotifications([notification]));
    store.userGateway.markNotificationAsSeen = mockResolve();

    await store.dispatch(markNotificationAsSeen(notification.id));

    expect(store.userGateway.markNotificationAsSeen).toHaveBeenCalledWith(notification.id);
  });

  it('marks a notification as seen', async () => {
    const notification = createNotification();
    const now = new Date();

    store.dateGateway.setNow(now);

    store.dispatch(setNotifications([notification]));
    store.dispatch(addNotifications([notification]));
    store.userGateway.markNotificationAsSeen = mockResolve();

    await store.dispatch(markNotificationAsSeen(notification.id));

    expect(store.select(selectNotification, notification.id)).toHaveProperty('seen', now.toISOString());
  });
});
