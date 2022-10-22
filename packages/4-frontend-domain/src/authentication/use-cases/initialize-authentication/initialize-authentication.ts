import { Thunk } from '../../../store.types';
import { fetchAuthenticatedUser } from '../../../user/use-cases/fetch-authenticated-user/fetch-authenticated-user';
import { clearAllAuthenticationErrors } from '../../authentication.actions';

export const initializeAuthentication = (): Thunk => {
  return async (dispatch, _getState, { routerGateway }) => {
    routerGateway.onLocationChange(() => {
      if (routerGateway.currentAuthenticationForm !== undefined) {
        dispatch(clearAllAuthenticationErrors());
      }
    });

    await dispatch(fetchAuthenticatedUser());
  };
};
