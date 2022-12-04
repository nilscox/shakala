import { AppThunk } from '../../../store';
import { notificationActions } from '../notification.actions';

export const markNotificationAsSeen = (notificationId: string): AppThunk<Promise<void>> => {
  return async (dispatch, getState, { notificationGateway, dateGateway, loggerGateway, snackbarGateway }) => {
    try {
      await notificationGateway.markNotificationAsSeen(notificationId);
      dispatch(notificationActions.setNotificationSeen(notificationId, dateGateway.nowAsString()));
      dispatch(notificationActions.decrementTotalUnseenNotifications());
    } catch (error) {
      loggerGateway.error(error);
      snackbarGateway.error("Quelque chose s'est mal passé");
    }
  };
};
