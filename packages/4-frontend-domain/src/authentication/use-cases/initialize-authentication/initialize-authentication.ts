import { Thunk } from '../../../store.types';
import { clearAllAuthenticationErrors } from '../../authentication.actions';
import { fetchAuthenticatedUser } from '../fetch-authenticated-user/fetch-authenticated-user';

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
