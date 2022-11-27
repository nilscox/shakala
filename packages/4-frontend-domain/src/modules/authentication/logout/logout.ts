import { AppThunk } from '../../../store';
import { routerActions } from '../../router';
import { userProfileActions } from '../../user-account/user-profile.actions';

// todo: fallback error handling
export const logout = (): AppThunk => {
  return async (dispatch, _getState, { authenticationGateway, snackbarGateway }) => {
    await authenticationGateway.logout();

    dispatch(routerActions.setPathname('/'));
    dispatch(userProfileActions.setAuthenticatedUser(null));
    snackbarGateway.success("Vous n'êtes maintenant plus connecté(e)");
  };
};
