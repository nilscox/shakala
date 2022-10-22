import { Thunk } from '../../../store.types';
import { unsetUser } from '../../../user';

export const logout = (): Thunk => {
  return async (
    dispatch,
    _getState,
    { authenticationGateway, routerGateway, snackbarGateway, timerGateway },
  ) => {
    await authenticationGateway.logout();

    routerGateway.navigate('/');
    snackbarGateway.success("Vous n'êtes maintenant plus connecté(e)");

    // unset the user after redirection
    timerGateway.setTimeout(() => dispatch(unsetUser()), 0);
  };
};
