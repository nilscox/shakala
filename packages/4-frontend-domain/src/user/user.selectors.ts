import { first, last } from 'shared';

import { State } from '../store.types';
import { UserActivity } from '../types';

import {
  selectUserActivities,
  selectAuthenticatedUser,
  selectIsFetchingAuthenticatedUser,
} from './use-cases';

export const selectUser = selectAuthenticatedUser;

export const selectUserOrFail = (state: State) => {
  const user = selectAuthenticatedUser(state);

  if (!user) {
    throw new Error('expected user to be defined');
  }

  return user;
};

export const selectIsFetchingUser = selectIsFetchingAuthenticatedUser;

export const selectIsLastUserActivity = (state: State, activity: UserActivity) => {
  return activity === first(selectUserActivities(state));
};

export const selectIsFirstUserActivity = (state: State, activity: UserActivity) => {
  return activity === last(selectUserActivities(state));
};
