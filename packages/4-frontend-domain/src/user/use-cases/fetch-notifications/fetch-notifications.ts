import { createAction, query, QueryState } from '@nilscox/redux-query';
import { AnyAction } from 'redux';

import { State, Thunk } from '../../../store.types';
import { Notification } from '../../../types';

type Key = {
  page: number;
};

const fetchNotificationsQuery = query<Key, Notification[]>('notifications');

export const fetchNotificationsReducer = fetchNotificationsQuery.reducer();

const actions = fetchNotificationsQuery.actions();
const selectors = fetchNotificationsQuery.selectors<State>((state) => state.user.queries.notifications);

export const setNotifications = actions.setSuccess;

const selectNotificationsPage = selectors.selectResult;

export const selectNotifications = (state: State) => {
  const notifications: Notification[] = [];
  let results: Notification[] | undefined;

  for (let page = 1; (results = selectNotificationsPage(state, { page })); page++) {
    notifications.push(...results);
  }

  return notifications;
};

export const selectIsLoadingNotifications = (state: State, page: number) => {
  return selectors.selectState(state, { page }) === QueryState.pending;
};

export const selectHasMoreNotifications = (state: State) => {
  const notifications = selectNotifications(state);
  const total = selectTotalNotifications(state);

  return notifications.length < total;
};

export const fetchNotifications = (page: number): Thunk<Promise<void>> => {
  const key: Key = { page };

  return async (dispatch, getState, { userGateway }) => {
    if (selectNotificationsPage(getState(), { page })) {
      return;
    }

    try {
      dispatch(actions.setPending(key));

      const { items: notifications, total } = await userGateway.listNotifications(page);

      dispatch(actions.setSuccess(key, notifications));
      dispatch(setTotalNotifications(total));
    } catch (error) {
      dispatch(actions.setError(key, error));
    }
  };
};

export const totalNotificationsReducer = (total = 0, action: AnyAction) => {
  if (isSetTotalNotificationsAction(action)) {
    return action.total;
  }

  return total;
};

export const [setTotalNotifications, isSetTotalNotificationsAction] = createAction(
  'notifications/set-total',
  (total: number) => ({ total }),
);

export const selectTotalNotifications = (state: State) => {
  return state.user.totalNotifications;
};
