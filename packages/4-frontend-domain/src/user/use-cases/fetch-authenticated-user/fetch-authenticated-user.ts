import { Thunk } from '../../../store.types';
import { setUser } from '../set-user/set-user';

export const fetchAuthenticatedUser = (): Thunk<Promise<void>> => {
  return async (dispatch, getState, { authenticationGateway }) => {
    const user = await authenticationGateway.fetchUser();

    if (user) {
      dispatch(setUser(user));
    }
  };
};
