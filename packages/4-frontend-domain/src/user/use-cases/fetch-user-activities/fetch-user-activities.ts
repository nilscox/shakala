import { createAction, query, QueryState } from '@nilscox/redux-query';
import { AnyAction } from 'redux';
import { first, last } from 'shared';

import { State, Thunk } from '../../../store.types';
import { UserActivity } from '../../../types';
import { DateFormat, formatDate, formatDistanceToNow, isBefore24Hours } from '../../../utils/format-date';

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

  return activities;
};

export const selectIsLoadingActivities = (state: State, page: number) => {
  return selectors.selectState(state, { page }) === QueryState.pending;
};

export const selectHasMoreActivities = (state: State) => {
  const activities = selectUserActivities(state);
  const total = selectTotalUserActivities(state);

  return activities.length < total;
};

export const selectIsLastUserActivity = (state: State, activity: UserActivity) => {
  return activity === first(selectUserActivities(state));
};

export const selectIsFirstUserActivity = (state: State, activity: UserActivity) => {
  if (selectHasMoreActivities(state)) {
    return false;
  }

  return activity === last(selectUserActivities(state));
};

export const formatActivityDate = ({ date }: UserActivity) => {
  if (isBefore24Hours(date)) {
    return formatDate(date, DateFormat.date);
  }

  return 'Il y a ' + formatDistanceToNow(date);
};

export const fetchUserActivities = (page: number): Thunk<Promise<void>> => {
  const key: Key = { page };

  return async (dispatch, getState, { userGateway }) => {
    if (selectUserActivitiesPage(getState(), { page })) {
      return;
    }

    try {
      dispatch(actions.setPending(key));

      const { items: activities, total } = await userGateway.listActivities(page);

      dispatch(actions.setSuccess(key, activities));
      dispatch(setTotalUserActivities(total));
    } catch (error) {
      dispatch(actions.setError(key, error));
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