import { AppThunk } from '../../../store';
import { authenticationSelectors } from '../authentication.selectors';
import { AuthenticationFormType, AuthenticationForm } from '../authentication.types';
import { login } from '../login/login';
import { signup } from '../signup/signup';

export const handleAuthenticate = (fields: AuthenticationForm): AppThunk<void> => {
  return (dispatch, getState) => {
    const currentAuthenticationForm = authenticationSelectors.currentForm(getState());

    switch (currentAuthenticationForm) {
      case AuthenticationFormType.login: {
        const { email, password } = fields;
        return dispatch(login(email, password));
      }

      case AuthenticationFormType.signup: {
        const { email, password, nick } = fields;
        return dispatch(signup(email, password, nick));
      }

      case AuthenticationFormType.emailLogin:
        // todo
        throw new Error('Not implemented');
    }
  };
};
