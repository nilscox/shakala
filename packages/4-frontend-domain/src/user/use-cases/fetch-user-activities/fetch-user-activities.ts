import { createAction, query } from '@nilscox/redux-query';
import { AnyAction } from 'redux';

import { State, Thunk } from '../../../store.types';
import { UserActivity } from '../../../types';

type Key = {
  page: number;
};

const fetchUserActivitiesQuery = query<Key, UserActivity[]>('user-activities');

export const fetchUserActivitiesReducer = fetchUserActivitiesQuery.reducer();

const actions = fetchUserActivitiesQuery.actions();
const selectors = fetchUserActivitiesQuery.selectors<State>((state) => state.user.queries.activities);

export const setUserActivities = actions.setSuccess;

const selectUserActivitiesPage = selectors.selectResult;

export const selectUserActivities = (state: State) => {
  const activities: UserActivity[] = [];
  let results: UserActivity[] | undefined;

  for (let page = 1; (results = selectUserActivitiesPage(state, { page })); page++) {
    activities.push(...results);
  }

  return activities.reverse();
};

export const fetchUserActivities = (page: number): Thunk<Promise<void>> => {
  const key: Key = { page };

  return async (dispatch, getState, { userGateway }) => {
    if (selectUserActivitiesPage(getState(), { page })) {
      return;
    }

    try {
      actions.setPending(key);

      const { items: activities, total } = await userGateway.listActivities(page);

      dispatch(actions.setSuccess(key, activities));
      dispatch(setTotalUserActivities(total));
    } catch (error) {
      actions.setError(key, error);
    }
  };
};

export const totalUserActivitiesReducer = (total = 0, action: AnyAction) => {
  if (isSetTotalUserActivitiesAction(action)) {
    return action.total;
  }

  return total;
};

export const [setTotalUserActivities, isSetTotalUserActivitiesAction] = createAction(
  'user-activities/set-total',
  (total: number) => ({ total }),
);

export const selectTotalUserActivities = (state: State) => {
  return state.user.totalActivities;
};