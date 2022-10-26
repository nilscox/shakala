import { createAction } from '@nilscox/redux-query';
import { AnyAction } from 'redux';

import { State, Thunk } from '../../../store.types';

const pollingInterval = 30 * 1_000;

export const pollNotificationsCount = (): Thunk<() => void> => {
  return (dispatch, getState, { timerGateway }) => {
    dispatch(fetchNotificationsCount());

    return timerGateway.setInterval(() => {
      dispatch(fetchNotificationsCount());
    }, pollingInterval);
  };
};

export const fetchNotificationsCount = (): Thunk<Promise<void>> => {
  return async (dispatch, getState, { userGateway }) => {
    dispatch(setUnseenNotificationsCount(await userGateway.getNotificationsCount()));
  };
};

export const unseenNotificationsCountReducer = (total = 0, action: AnyAction) => {
  if (isSetUnseenNotificationsCountAction(action)) {
    return action.total;
  }

  return total;
};

export const [setUnseenNotificationsCount, isSetUnseenNotificationsCountAction] = createAction(
  'notifications/set-unseen-count',
  (total: number) => ({ total }),
);

export const selectUnseenNotificationsCount = (state: State) => {
  return state.user.unseenNotificationsCount;
};
