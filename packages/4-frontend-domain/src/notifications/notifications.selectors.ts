import { createNormalizedSelectors } from '@nilscox/redux-query';

import { selectNormalizedEntities, notificationSchema } from '../normalization';
import { State } from '../store.types';
import { Notification } from '../types';

export const notificationSelectors = createNormalizedSelectors<State, Notification>(
  selectNormalizedEntities,
  notificationSchema,
);

export const selectNotification = notificationSelectors.selectEntity;

export const selectNotifications = (state: State) => {
  return notificationSelectors.selectEntities(state, state.notifications.list);
};

export const selectTotalNotifications = (state: State) => {
  return state.notifications.total;
};

export const selectHasMoreNotifications = (state: State) => {
  const notifications = selectNotifications(state);
  const total = selectTotalNotifications(state);

  return notifications.length < total;
};

export const selectIsLoadingNotifications = (state: State) => {
  return state.notifications.loading;
};
