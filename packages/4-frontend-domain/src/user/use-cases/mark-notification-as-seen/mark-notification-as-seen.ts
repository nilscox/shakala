import { Thunk } from '../../../store.types';

export const markNotificationAsSeen = (notificationId: string): Thunk<Promise<void>> => {
  // todo: error handling
  return async (dispatch, getState, { userGateway }) => {
    await userGateway.markNotificationAsSeen(notificationId);
  };
};
