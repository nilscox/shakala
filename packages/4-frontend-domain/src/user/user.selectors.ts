import { State } from '../store.types';
import { safeSelector } from '../utils/safe-selector';

export const selectUserUnsafe = (state: State) => {
  return state.authenticatedUser ?? undefined;
};

export const selectUser = safeSelector('authenticatedUser', selectUserUnsafe);
