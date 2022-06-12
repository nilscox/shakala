import type { Thunk } from '../../store';
import { unsetUser } from '../user.slice';

export const logout = (): Thunk => {
  return async (dispatch, _getState, { authenticationGateway }) => {
    await authenticationGateway.logout();

    dispatch(unsetUser());
  };
};
