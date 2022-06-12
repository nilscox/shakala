import type { Thunk } from '../../store';
import { clearAllAuthenticationFieldErrors, setAuthenticating } from '../authentication.slice';
import { setUser } from '../user.slice';

import { handleAuthenticationError } from './handle-authentication-error';

export const login = (email: string, password: string): Thunk => {
  return async (dispatch, _getState, { authenticationGateway }) => {
    dispatch(clearAllAuthenticationFieldErrors());

    try {
      dispatch(setAuthenticating({ authenticating: true }));

      const user = await authenticationGateway.login(email, password);

      dispatch(setUser({ user }));
    } catch (error) {
      dispatch(handleAuthenticationError(error));
    } finally {
      dispatch(setAuthenticating({ authenticating: false }));
    }
  };
};
