import { State } from '../store.types';

import { selectAuthenticatedUser, selectIsFetchingAuthenticatedUser } from './use-cases';

export const selectUser = selectAuthenticatedUser;

export const selectUserOrFail = (state: State) => {
  const user = selectAuthenticatedUser(state);

  if (!user) {
    throw new Error('expected user to be defined');
  }

  return user;
};

export const selectIsFetchingUser = selectIsFetchingAuthenticatedUser;
