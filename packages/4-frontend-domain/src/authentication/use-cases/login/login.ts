import { Thunk } from '../../../store';
import { setUser } from '../../../user';
import { clearAllAuthenticationErrors, setAuthenticating } from '../../authentication.actions';
import { closeAuthenticationForm } from '../close-authentication-form/close-authentication-form';
import { handleAuthenticationError } from '../handle-authentication-error/handle-authentication-error';

export const login = (email: string, password: string): Thunk => {
  return async (dispatch, _getState, { authenticationGateway, snackbarGateway }) => {
    dispatch(clearAllAuthenticationErrors());

    try {
      dispatch(setAuthenticating(true));

      const user = await authenticationGateway.login(email, password);

      dispatch(setUser(user));
      dispatch(closeAuthenticationForm());

      snackbarGateway.success('Vous êtes maintenant connecté(e)');
    } catch (error) {
      dispatch(handleAuthenticationError(error));
    } finally {
      dispatch(setAuthenticating(false));
    }
  };
};
