import { getIds } from '@shakala/shared';

import { AppThunk } from '../../../store';
import { notificationActions } from '../notification.actions';

export const fetchNotifications = (page: number): AppThunk<Promise<void>> => {
  return async (dispatch, getState, { notificationGateway, snackbarGateway, loggerGateway }) => {
    try {
      dispatch(notificationActions.setFetching(true));

      const { items: notifications, total } = await notificationGateway.fetchNotifications(page);

      dispatch(notificationActions.setNotifications(notifications));

      if (page === 1) {
        dispatch(notificationActions.setList(getIds(notifications)));
      } else {
        dispatch(notificationActions.addToList(getIds(notifications)));
      }

      dispatch(notificationActions.setTotal(total));
    } catch (error) {
      loggerGateway.error(error);
      snackbarGateway.error("Quelque chose s'est mal passé lors du chargement de vos notifications");
    } finally {
      dispatch(notificationActions.setFetching(false));
    }
  };
};
