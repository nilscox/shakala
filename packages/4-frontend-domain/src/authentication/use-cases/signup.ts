import type { Thunk } from '../../store';
import { clearAllAuthenticationFieldErrors, setAuthenticating } from '../authentication.slice';
import { setUser } from '../user.slice';

import { handleAuthenticationError } from './handle-authentication-error';

export const signup = (email: string, password: string, nick: string): Thunk => {
  return async (dispatch, _getState, { authenticationGateway }) => {
    dispatch(clearAllAuthenticationFieldErrors());

    try {
      dispatch(setAuthenticating({ authenticating: true }));

      const user = await authenticationGateway.signup(email, password, nick);

      dispatch(setUser({ user }));
    } catch (error) {
      dispatch(handleAuthenticationError(error));
    } finally {
      dispatch(setAuthenticating({ authenticating: false }));
    }
  };
};
