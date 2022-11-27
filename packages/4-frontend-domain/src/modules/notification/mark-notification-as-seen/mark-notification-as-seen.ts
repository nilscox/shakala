import { AppThunk } from '../../../store';
import { notificationActions } from '../notification.actions';

export const markNotificationAsSeen = (notificationId: string): AppThunk<Promise<void>> => {
  // todo: error handling
  return async (dispatch, getState, { notificationGateway, dateGateway }) => {
    await notificationGateway.markNotificationAsSeen(notificationId);
    dispatch(notificationActions.setNotificationSeen(notificationId, dateGateway.nowAsString()));
    dispatch(notificationActions.decrementTotalUnseenNotifications());
  };
};
