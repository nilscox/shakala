import { normalized } from '@nilscox/redux-query';
import { AnyAction, combineReducers } from 'redux';
import { getIds } from 'shared';

import { schemas } from '../normalization';
import { Notification } from '../types';

import { setNotificationSeen } from './mark-notification-as-seen/mark-notification-as-seen';
import {
  isAddNotifications,
  isSetLoadingNotifications,
  isSetTotalNotifications,
} from './notifications.actions';

const notificationsListReducer = (ids: string[] = [], action: AnyAction): string[] => {
  if (isAddNotifications(action)) {
    return [...ids, ...getIds(action.notifications)];
  }

  return ids;
};

const totalNotificationsReducer = (total = 0, action: AnyAction): number => {
  if (isSetTotalNotifications(action)) {
    return action.total;
  }

  return total;
};

const loadingNotificationsReducer = (loading = false, action: AnyAction): boolean => {
  if (isSetLoadingNotifications(action)) {
    return action.loading;
  }

  return loading;
};

export const notificationsReducer = combineReducers({
  entities: normalized<Notification>(schemas, 'notification', (notifications, action) => {
    if (setNotificationSeen.isAction(action)) {
      return setNotificationSeen.reducer(notifications, action);
    }

    return notifications;
  }),
  list: notificationsListReducer,
  total: totalNotificationsReducer,
  loading: loadingNotificationsReducer,
});
