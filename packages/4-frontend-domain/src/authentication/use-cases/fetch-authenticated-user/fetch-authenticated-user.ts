import { Thunk } from '../../../store';
import { setUser } from '../../user.slice';

export const fetchAuthenticatedUser = (): Thunk => {
  return async (dispatch, _getState, { authenticationGateway }) => {
    const user = await authenticationGateway.fetchUser();

    if (user) {
      dispatch(setUser(user));
    }
  };
};
