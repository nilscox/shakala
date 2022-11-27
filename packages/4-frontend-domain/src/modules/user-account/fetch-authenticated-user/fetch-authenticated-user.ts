import { AppThunk } from '../../../store';
import { userProfileActions } from '../user-profile.actions';

export const fetchAuthenticatedUser = (): AppThunk => {
  return async (dispatch, getState, { authenticationGateway }) => {
    try {
      dispatch(userProfileActions.setFetching(true));

      const user = await authenticationGateway.fetchAuthenticatedUser();

      if (user) {
        dispatch(userProfileActions.setAuthenticatedUser(user));
      }
    } finally {
      dispatch(userProfileActions.setFetching(false));
    }
  };
};
