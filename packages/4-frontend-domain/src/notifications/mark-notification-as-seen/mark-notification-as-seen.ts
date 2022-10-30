import { Thunk } from '../../store.types';
import { Notification } from '../../types';
import { createEntityAction } from '../../utils/create-entity-action';

export const setNotificationSeen = createEntityAction(
  'notification/set-seen',
  (notification: Notification, now: string): Notification => ({
    ...notification,
    seen: now,
  }),
);

export const markNotificationAsSeen = (notificationId: string): Thunk<Promise<void>> => {
  // todo: error handling
  return async (dispatch, getState, { userGateway, dateGateway }) => {
    await userGateway.markNotificationAsSeen(notificationId);
    dispatch(setNotificationSeen(notificationId, dateGateway.now().toISOString()));
  };
};
