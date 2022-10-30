import { AnyAction } from 'redux';

import { AuthUser } from '../types';

import { isSetUserAction, isUnsetUserAction, isUpdateUserAction } from './use-cases/set-user/set-user';

export const authenticatedUserReducer = (
  user: AuthUser | null = null,
  action: AnyAction,
): AuthUser | null => {
  if (isSetUserAction(action)) {
    return action.user;
  }

  if (isUnsetUserAction(action)) {
    return null;
  }

  if (user && isUpdateUserAction(action)) {
    return { ...user, ...action.changes };
  }

  return user;
};
