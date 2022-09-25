import { State } from '../store.types';

export const selectUser = (state: State) => state.user;

export const selectUserOrFail = (state: State) => {
  const user = selectUser(state);

  if (!user) {
    throw new Error('expected user to be defined');
  }

  return user;
};
