import { AuthorizationError, AuthorizationErrorReason, InvalidCredentials } from 'shared';

import { AppThunk } from '../../../store';
import { ValidationErrors } from '../../../utils/validation-error';
import { userProfileActions } from '../../user-account/user-profile.actions';
import { closeAuthenticationForm } from '../require-authentication/require-authentication';

export const login = (email: string, password: string): AppThunk<Promise<void>> => {
  return async (dispatch, _getState, { authenticationGateway, snackbarGateway, loggerGateway }) => {
    try {
      const user = await authenticationGateway.login(email, password);

      dispatch(userProfileActions.setAuthenticatedUser(user));
      dispatch(closeAuthenticationForm());

      // routerGateway.redirectAfterAuthentication();
      snackbarGateway.success('Vous êtes maintenant connecté(e)');
    } catch (error) {
      if (error instanceof ValidationErrors || error instanceof InvalidCredentials) {
        throw error;
      } else if (
        // todo: AuthorizationError.is
        error instanceof AuthorizationError &&
        error.details.reason === AuthorizationErrorReason.authenticated
      ) {
        snackbarGateway.warning('Vous êtes déjà connecté(e)');
      } else {
        loggerGateway.error(error);
        snackbarGateway.error("Une erreur s'est produite");
      }
    }
  };
};
