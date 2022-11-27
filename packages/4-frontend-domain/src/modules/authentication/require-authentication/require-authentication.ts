import { AppThunk } from '../../../store';
import { routerActions } from '../../router';
import { AuthenticatedUser } from '../../user-account';
import { userProfileSelectors } from '../../user-account/user-profile.selectors';
import { AuthenticationFormType } from '../authentication.types';

export const requireAuthentication = (): AppThunk<AuthenticatedUser | null> => {
  return (dispatch, getState) => {
    const user = userProfileSelectors.authenticatedUser(getState());

    if (!user) {
      dispatch(setCurrentAuthenticationForm(AuthenticationFormType.login));
    }

    return user;
  };
};

export const setCurrentAuthenticationForm = (form: AuthenticationFormType) => {
  return routerActions.setQueryParam(['auth', form]);
};

export const closeAuthenticationForm = () => {
  return routerActions.removeQueryParam('auth');
};
