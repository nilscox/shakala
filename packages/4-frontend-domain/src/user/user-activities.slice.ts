import { AnyAction } from 'redux';

import { UserActivity } from '../types';

import { isAddUserActivitiesAction, isSetTotalUserActivitiesAction } from './user.actions';

type UserActivitiesState = {
  items: UserActivity[];
  total: number;
};

export const userActivitiesReducer = (
  state: UserActivitiesState = { items: [], total: 0 },
  action: AnyAction,
): UserActivitiesState => {
  if (isSetTotalUserActivitiesAction(action)) {
    return { ...state, total: action.total };
  }

  if (isAddUserActivitiesAction(action)) {
    return { ...state, items: [...state.items, ...action.activities] };
  }

  return state;
};
