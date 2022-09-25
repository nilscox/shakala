import { AnyAction } from 'redux';

import { AuthUser } from '../types';

import { isSetUserAction, isUnsetUserAction, isUpdateUserAction } from './user.actions';

type UserState = AuthUser | null;

export const userReducer = (user: UserState = null, action: AnyAction): UserState => {
  if (isSetUserAction(action)) {
    return action.user;
  }

  if (!user) {
    return null;
  }

  if (isUnsetUserAction(action)) {
    return null;
  }

  if (isUpdateUserAction(action)) {
    return { ...user, ...action.changes };
  }

  return user;
};
