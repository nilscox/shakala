import { createAction } from '@nilscox/redux-query';

import { AuthUser } from '../types';

export const [setUser, isSetUserAction] = createAction('user/set', (user: AuthUser) => ({
  user,
}));

export const [unsetUser, isUnsetUserAction] = createAction('user/unset');

export const [updateUser, isUpdateUserAction] = createAction('user/update', (changes: Partial<AuthUser>) => ({
  changes,
}));
