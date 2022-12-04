import { AppThunk } from '../../../store';
import { routerActions } from '../../router';
import { userProfileActions } from '../../user-account/user-profile.actions';

export const logout = (): AppThunk => {
  return async (dispatch, _getState, { authenticationGateway, snackbarGateway, loggerGateway }) => {
    try {
      await authenticationGateway.logout();

      dispatch(routerActions.setPathname('/'));
      dispatch(userProfileActions.setAuthenticatedUser(null));
      snackbarGateway.success("Vous n'êtes maintenant plus connecté(e)");
    } catch (error) {
      loggerGateway.error(error);
      snackbarGateway.error("Quelque chose s'est mal passé");
    }
  };
};
