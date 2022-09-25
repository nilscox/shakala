import { Thunk } from '../../../store';
import { unsetUser } from '../../../user';

export const logout = (): Thunk => {
  return async (dispatch, _getState, { authenticationGateway, routerGateway, snackbarGateway }) => {
    await authenticationGateway.logout();

    dispatch(unsetUser());

    routerGateway.navigate('/');
    snackbarGateway.success("Vous n'êtes maintenant plus connecté(e)");
  };
};
