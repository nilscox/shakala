import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';
import {
  AuthenticationField,
  AuthenticationType,
  setAuthenticationFieldError,
  setAuthenticationFormError,
} from 'frontend-domain';
import { createMemoryHistory } from 'history';

import { reduxDecorator, routerDecorator, SetupRedux } from '~/utils/storybook';

import { AuthenticationForm } from './authentication-form';

const history = createMemoryHistory();

export default {
  title: 'Domain/Authentication',
  decorators: [
    (Story) => (
      <div className="max-w-3 rounded-lg border bg-neutral p-4">
        <Story />
      </div>
    ),
    reduxDecorator(),
    routerDecorator(history),
  ],
} as Meta;

const Template: Story<{ setup: SetupRedux }> = (props) => (
  <AuthenticationForm onClose={action('onClose')} {...props} />
);

const setAuthSearchParam = (auth: AuthenticationType) => {
  history.push({ pathname: '/toto', search: '?' + new URLSearchParams({ auth }) });
};

export const login = Template.bind({});
login.args = {
  setup(_dispatch, { routerGateway }) {
    setAuthSearchParam(AuthenticationType.login);
    routerGateway.currentAuthenticationForm = AuthenticationType.login;
  },
};

export const signup = Template.bind({});
signup.args = {
  setup(_dispatch, { routerGateway }) {
    setAuthSearchParam(AuthenticationType.signup);
    routerGateway.currentAuthenticationForm = AuthenticationType.signup;
  },
};

export const emailLogin = Template.bind({});
emailLogin.args = {
  setup(_dispatch, { routerGateway }) {
    setAuthSearchParam(AuthenticationType.emailLogin);
    routerGateway.currentAuthenticationForm = AuthenticationType.emailLogin;
  },
};

export const withErrors = Template.bind({});
withErrors.args = {
  setup(dispatch, { routerGateway }) {
    setAuthSearchParam(AuthenticationType.signup);
    routerGateway.currentAuthenticationForm = AuthenticationType.signup;

    dispatch(setAuthenticationFieldError(AuthenticationField.email, 'EmailAlreadyExists'));

    dispatch(setAuthenticationFieldError(AuthenticationField.nick, 'min'));
    dispatch(setAuthenticationFormError('InvalidCredentials'));
  },
};
