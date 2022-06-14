import { Thunk } from '../../../store';
import { AuthenticationForm } from '../../authentication.types';
import { selectAuthenticationForm } from '../../selectors/authentication.selectors';
import { login } from '../login/login';
import { signup } from '../signup/signup';

export const handleAuthenticate = (form: FormData): Thunk => {
  return (dispatch, getState) => {
    const email = form.get('email') as string;
    const password = form.get('password') as string;
    const nick = form.get('nick') as string;

    const authForm = selectAuthenticationForm(getState());

    switch (authForm) {
      case AuthenticationForm.login:
        return dispatch(login(email, password));

      case AuthenticationForm.signup:
        return dispatch(signup(email, password, nick));

      case AuthenticationForm.emailLogin:
        // todo
        throw new Error('Not implemented');
    }
  };
};
