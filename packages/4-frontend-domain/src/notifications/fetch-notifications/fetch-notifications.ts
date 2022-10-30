import { Thunk } from '../../store.types';
import {
  addNotifications,
  setLoadingNotification,
  setNotifications,
  setTotalNotifications,
} from '../notifications.actions';

export const fetchNotifications = (page: number): Thunk<Promise<void>> => {
  return async (dispatch, getState, { userGateway }) => {
    try {
      dispatch(setLoadingNotification(true));

      const { items: notifications, total } = await userGateway.listNotifications(page);

      dispatch(setNotifications(notifications));
      dispatch(addNotifications(notifications));
      dispatch(setTotalNotifications(total));
    } catch (error) {
      // todo
      console.error(error);
    } finally {
      dispatch(setLoadingNotification(false));
    }
  };
};
