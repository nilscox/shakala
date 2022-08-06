import { Thunk } from '../../../store';
import { AuthenticationForm, AuthenticationType, LoginForm, SignupForm } from '../../authentication.types';
import { selectAuthenticationForm } from '../../selectors/authentication.selectors';
import { login } from '../login/login';
import { signup } from '../signup/signup';

export const handleAuthenticate = (form: AuthenticationForm): Thunk => {
  return (dispatch, getState) => {
    const authForm = selectAuthenticationForm(getState());

    switch (authForm) {
      case AuthenticationType.login: {
        const { email, password } = form as LoginForm;
        return dispatch(login(email, password));
      }

      case AuthenticationType.signup: {
        const { email, password, nick } = form as SignupForm;
        return dispatch(signup(email, password, nick));
      }

      case AuthenticationType.emailLogin:
        // todo
        throw new Error('Not implemented');
    }
  };
};
