import { Meta, StoryFn } from '@storybook/react';
import { useEffect } from 'react';

import { configureStory, controls, useStorybookRouter } from '~/utils/storybook';
import { ValidationErrors } from '~/utils/validation-errors';

import { AuthenticationModal } from './authentication-modal';
import { AuthForm } from './types';

type Args = {
  type: AuthForm;
  validationErrors: boolean;
  emailAlreadyExists: boolean;
  invalidCredentials: boolean;
};

export default {
  title: 'Domain/Authentication',
  parameters: {
    pageContext: {
      urlParsed: {
        searchOriginal: '',
      },
    },
  },
  args: {
    type: AuthForm.signIn,
    validationErrors: false,
    emailAlreadyExists: false,
    invalidCredentials: false,
  },
  argTypes: {
    type: controls.enum(AuthForm),
  },
} as Meta<Args>;

// eslint-disable-next-line no-empty-pattern
export const authentication: StoryFn<Args> = ({}) => <AuthenticationModal />;

authentication.decorators = [
  configureStory((adapters, args) => {
    const { setSearchParam } = useStorybookRouter();

    useEffect(() => {
      setSearchParam('auth', args.type);
    }, [setSearchParam, args]);

    if (args.validationErrors) {
      adapters.authentication.signIn.reject(
        new ValidationErrors({
          email: 'email',
          password: 'min',
          nick: 'alreadyExists',
        })
      );
    }

    if (args.emailAlreadyExists) {
      adapters.authentication.signIn.reject(new ValidationErrors({ email: 'alreadyExists' }));
    }

    if (args.invalidCredentials) {
      adapters.authentication.signIn.reject(new Error('InvalidCredentials'));
    }
  }),
];
