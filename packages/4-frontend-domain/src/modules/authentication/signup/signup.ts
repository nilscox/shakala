import { AuthorizationErrorReason } from 'shared';

import { AppThunk } from '../../../store';
import { ValidationErrors } from '../../../utils/validation-error';
import { AuthorizationError } from '../../authorization';
import { userProfileActions } from '../../user-account/user-profile.actions';
import { closeAuthenticationForm } from '../require-authentication/require-authentication';

export const signup = (email: string, password: string, nick: string): AppThunk => {
  return async (
    dispatch,
    _getState,
    { authenticationGateway, dateGateway, snackbarGateway, loggerGateway },
  ) => {
    try {
      const userId = await authenticationGateway.signup(email, password, nick);

      const user = userProfileActions.setAuthenticatedUser({
        id: userId,
        email,
        nick,
        signupDate: dateGateway.nowAsString(),
      });

      dispatch(user);
      dispatch(closeAuthenticationForm());

      // routerGateway.redirectAfterAuthentication();
      snackbarGateway.success(
        `Votre compte a bien été créé ! Un email de validation a été envoyé à l'adresse ${email}.`,
      );
    } catch (error) {
      if (error instanceof ValidationErrors) {
        throw error;
      } else if (
        error instanceof AuthorizationError &&
        error.reason === AuthorizationErrorReason.authenticated
      ) {
        snackbarGateway.warning('Vous êtes déjà connecté(e)');
      } else {
        loggerGateway.error(error);
        snackbarGateway.error("Une erreur s'est produite");
      }
    }
  };
};
