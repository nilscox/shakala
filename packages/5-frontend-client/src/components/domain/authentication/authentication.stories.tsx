import { Meta, Story } from '@storybook/react';
import {
  AuthenticationField,
  AuthenticationType,
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
      <div className="max-w-modal rounded-lg border bg-neutral p-4">
        <Story />
      </div>
    ),
    reduxDecorator(),
    routerDecorator(),
  ],
} as Meta;

const Template: Story<{ form: AuthenticationType; setup?: (dispatch: Dispatch) => void }> = ({
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

export const login = () => <Template form={AuthenticationType.login} />;
export const signup = () => <Template form={AuthenticationType.signup} />;
export const emailLogin = () => <Template form={AuthenticationType.emailLogin} />;

export const withErrors = () => (
  <Template
    form={AuthenticationType.signup}
    setup={(dispatch) => {
      dispatch(setAuthenticationFieldError(AuthenticationField.email, 'EmailAlreadyExists'));

      dispatch(setAuthenticationFieldError(AuthenticationField.nick, 'min'));
      dispatch(setAuthenticationFormError('InvalidCredentials'));
    }}
  />
);
