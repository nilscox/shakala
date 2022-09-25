import { Thunk } from '../../../store.types';
import { setUser } from '../../../user';

export const fetchAuthenticatedUser = (): Thunk => {
  return async (dispatch, _getState, { authenticationGateway }) => {
    const user = await authenticationGateway.fetchUser();

    if (user) {
      dispatch(setUser(user));
    }
  };
};
