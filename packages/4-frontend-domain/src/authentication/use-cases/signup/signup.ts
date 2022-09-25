import { Thunk } from '../../../store';
import { setUser } from '../../../user/user.slice';
import { clearAllAuthenticationErrors, setAuthenticating } from '../../actions/authentication.actions';
import { closeAuthenticationForm } from '../close-authentication-form/close-authentication-form';
import { handleAuthenticationError } from '../handle-authentication-error/handle-authentication-error';

export const signup = (email: string, password: string, nick: string): Thunk => {
  return async (dispatch, _getState, { authenticationGateway, snackbarGateway }) => {
    dispatch(clearAllAuthenticationErrors());

    try {
      dispatch(setAuthenticating(true));

      const user = await authenticationGateway.signup(email, password, nick);

      dispatch(setUser(user));
      dispatch(closeAuthenticationForm());

      snackbarGateway.success(
        `Votre compte a bien été créé ! Un email de validation a été envoyé à l'adresse ${email}.`,
      );
    } catch (error) {
      dispatch(handleAuthenticationError(error));
    } finally {
      dispatch(setAuthenticating(false));
    }
  };
};
