import { createAction } from '@nilscox/redux-query';
import { AnyAction } from 'redux';

import { AuthUser } from '../types';

const [setUser, isSetUserAction] = createAction('user/set', (user: AuthUser) => ({
  user,
}));

const [unsetUser, isUnsetUserAction] = createAction('user/unset');

const [updateUser, isUpdateUserAction] = createAction('user/update', (changes: Partial<AuthUser>) => ({
  changes,
}));

export { setUser, unsetUser, updateUser };

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
