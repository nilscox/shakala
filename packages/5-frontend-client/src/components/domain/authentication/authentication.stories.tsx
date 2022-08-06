import { Meta, Story } from '@storybook/react';
import {
  AuthenticationField,
  AuthenticationForm as AuthenticationFormType,
  Dispatch,
  selectAuthenticationFormUnsafe,
  setAuthenticationFieldError,
  setAuthenticationForm,
  setAuthenticationFormError,
} from 'frontend-domain';
import { useEffect } from 'react';

import { useDispatch } from '~/hooks/use-dispatch';
import { useSelector } from '~/hooks/use-selector';
import { reduxDecorator, routerDecorator } from '~/utils/storybook';

import { AuthenticationForm } from './authentication-form';

export default {
  title: 'Domain/Authentication',
  decorators: [
    (Story) => (
      <div className="p-4 max-w-modal bg-neutral rounded-lg border">
        <Story />
      </div>
    ),
    reduxDecorator(),
    routerDecorator(),
  ],
} as Meta;

const Template: Story<{ form: AuthenticationFormType; setup?: (dispatch: Dispatch) => void }> = ({
  form,
  setup,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAuthenticationForm(form));
    setup?.(dispatch);
  }, [dispatch, setup, form]);

  if (!useSelector(selectAuthenticationFormUnsafe)) {
    return <></>;
  }

  return <AuthenticationForm />;
};

export const login = () => <Template form={AuthenticationFormType.login} />;
export const signup = () => <Template form={AuthenticationFormType.signup} />;
export const emailLogin = () => <Template form={AuthenticationFormType.emailLogin} />;

export const withErrors = () => (
  <Template
    form={AuthenticationFormType.signup}
    setup={(dispatch) => {
      dispatch(setAuthenticationFieldError(AuthenticationField.email, 'EmailAlreadyExists'));

      dispatch(setAuthenticationFieldError(AuthenticationField.nick, 'min'));
      dispatch(setAuthenticationFormError('InvalidCredentials'));
    }}
  />
);
