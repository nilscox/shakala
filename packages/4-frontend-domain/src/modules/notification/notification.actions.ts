import { EntitiesState, EntityActions, EntityAdapter } from '@nilscox/redux-kooltik';

import { fetchNotifications } from './fetch-notifications/fetch-notifications';
import { markNotificationAsSeen } from './mark-notification-as-seen/mark-notification-as-seen';
import { Notification } from './notification.types';
import {
  fetchTotalUnseenNotifications,
  pollNotificationsCount,
} from './poll-notifications-count/poll-notifications-count';

export type NotificationMeta = {
  fetching: boolean;
  total: number;
  totalUnseen: number;
};

class NotificationActions extends EntityActions<Notification, NotificationMeta> {
  private adapter = new EntityAdapter<Notification>((notification) => notification.id);

  constructor() {
    super('notification', {
      fetching: false,
      total: 0,
      totalUnseen: 0,
    });
  }

  addNotifications = this.action('add-notifications', this.adapter.addMany);
  setNotifications = this.action('set-notifications', this.adapter.setMany);

  setList = this.createSetter('ids');
  addToList = this.action('add-ids', (state: EntitiesState<Notification>, ids: string[]) => {
    state.ids.push(...ids);
  });

  setFetching = this.createSetter('fetching');
  setTotal = this.createSetter('total');
  setTotalUnseen = this.createSetter('totalUnseen', 'total-unseen');

  decrementTotalUnseenNotifications = this.action('notification/decrement', (state) => {
    state.totalUnseen--;
  });

  setNotificationSeen = this.entityAction(
    'notification/set-seen',
    (notification: Notification, now: string) => {
      notification.seen = now;
    },
  );

  fetchNotifications = fetchNotifications;
  fetchTotalUnseenNotifications = fetchTotalUnseenNotifications;
  markNotificationAsSeen = markNotificationAsSeen;
  pollNotificationsCount = pollNotificationsCount;
}

export const notificationActions = new NotificationActions();
