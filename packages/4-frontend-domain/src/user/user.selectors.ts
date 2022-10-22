import { first, last } from 'shared';

import { State } from '../store.types';
import { UserActivity } from '../types';

import { selectAuthenticatedUser } from './use-cases/fetch-authenticated-user/fetch-authenticated-user';

export const selectUser = selectAuthenticatedUser;

export const selectUserOrFail = (state: State) => {
  const user = selectAuthenticatedUser(state);

  if (!user) {
    throw new Error('expected user to be defined');
  }

  return user;
};

const selectUserActivitiesState = (state: State) => state.userActivities;

export const selectUserActivities = (state: State) => {
  return selectUserActivitiesState(state).items.slice().reverse();
};

export const selectTotalUserActivities = (state: State) => {
  return selectUserActivitiesState(state).total;
};

export const selectIsLastUserActivity = (state: State, activity: UserActivity) => {
  return activity === first(selectUserActivities(state));
};

export const selectIsFirstUserActivity = (state: State, activity: UserActivity) => {
  return activity === last(selectUserActivities(state));
};
