import { AppThunk } from '../../../store';
import { notificationActions } from '../notification.actions';
import { notificationSelectors } from '../notification.selectors';

const pollingInterval = 30 * 1_000;

export const pollNotificationsCount = (): AppThunk<() => void> => {
  return (dispatch, getState, { timerGateway }) => {
    return timerGateway.setInterval(() => {
      void dispatch(fetchTotalUnseenNotifications());
    }, pollingInterval);
  };
};

export const fetchTotalUnseenNotifications = (): AppThunk => {
  return async (dispatch, getState, { notificationGateway }) => {
    const totalUnseen = await notificationGateway.fetchUnseenNotificationsCount();

    if (totalUnseen !== notificationSelectors.totalUnseen(getState())) {
      dispatch(notificationActions.setTotalUnseen(totalUnseen));
    }
  };
};
