import { Meta } from '@storybook/react';
import {
  authenticationActions,
  AuthenticationFormType,
  createAuthUser,
  ValidationErrors,
} from 'frontend-domain';
import { InvalidCredentials } from 'shared';

import { controls, reduxDecorator, ReduxStory } from '~/utils/storybook';

import { AuthenticationModal } from './authentication-modal';

type Args = {
  type: AuthenticationFormType;
  validationErrors: boolean;
  emailAlreadyExists: boolean;
  invalidCredentials: boolean;
};

export default {
  title: 'Domain/Authentication',
  decorators: [reduxDecorator()],
  argTypes: {
    type: controls.enum(AuthenticationFormType, AuthenticationFormType.login),
    validationErrors: controls.boolean(false),
    emailAlreadyExists: controls.boolean(false),
    invalidCredentials: controls.boolean(false),
  },
} as Meta<Args>;

export const authentication: ReduxStory<Args> = () => <AuthenticationModal />;

authentication.args = {
  setup(dispatch, getState, { args, authenticationGateway }) {
    dispatch(authenticationActions.setAuthenticationForm(args.type));

    authenticationGateway.login.resolve(createAuthUser());
    authenticationGateway.signup.resolve('');

    if (args.validationErrors) {
      authenticationGateway.signup.reject(
        new ValidationErrors({
          email: { value: '', error: 'email' },
          password: { value: '', error: 'min' },
          nick: { value: '', error: 'alreadyExists' },
        }),
      );
    }

    if (args.emailAlreadyExists) {
      authenticationGateway.signup.reject(
        new ValidationErrors({ email: { value: '', error: 'alreadyExists' } }),
      );
    }

    if (args.invalidCredentials) {
      authenticationGateway.login.reject(new InvalidCredentials());
    }
  },
};
