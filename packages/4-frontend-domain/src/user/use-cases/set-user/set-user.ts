import { createAction } from '@nilscox/redux-query';

import { AuthUser } from '../../../types';

export const [setUser, isSetUserAction] = createAction('set-user', (user: AuthUser) => ({
  user,
}));

export const [unsetUser, isUnsetUserAction] = createAction('unset-user');

export const [updateUser, isUpdateUserAction] = createAction('update-user', (changes: Partial<AuthUser>) => ({
  changes,
}));
