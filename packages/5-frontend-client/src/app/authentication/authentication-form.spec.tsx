import { screen, waitFor } from '@testing-library/react';
import {
  authenticationActions,
  AuthenticationFormType,
  createAuthUser,
  createTestStore,
  TestStore,
  userProfileSelectors,
} from 'frontend-domain';
import { mockFn } from 'shared/test';

import { AuthenticationForm } from '~/app/authentication/authentication-form';
import { createTestRenderer, TestRenderer } from '~/utils/test-renderer';

describe('AuthenticationForm', () => {
  let store: TestStore;
  let render: TestRenderer;

  beforeEach(() => {
    store = createTestStore();
    render = createTestRenderer().withConfig({ isDevelopment: false }).withStore(store);
  });

  it('fills and submits the login form', async () => {
    const authUser = createAuthUser();

    store.dispatch(authenticationActions.setAuthenticationForm(AuthenticationFormType.login));
    store.authenticationGateway.login.resolve(authUser);

    const user = render(<AuthenticationForm onClose={mockFn()} />);

    await user.type(screen.getByPlaceholderText('Email'), 'user@domain.tld');
    await user.type(screen.getByPlaceholderText('Mot de passe'), 'password');
    await user.click(screen.getByRole('button', { name: 'Connexion' }));

    await waitFor(() => {
      expect(store.select(userProfileSelectors.authenticatedUser)).toEqual(authUser);
    });
  });

  it('fills and submits the signup form', async () => {
    store.dispatch(authenticationActions.setAuthenticationForm(AuthenticationFormType.signup));
    store.authenticationGateway.signup.resolve('userId');

    const user = render(<AuthenticationForm onClose={mockFn()} />);

    await user.type(screen.getByPlaceholderText('Email'), 'user@domain.tld');
    await user.type(screen.getByPlaceholderText('Mot de passe'), 'password');
    await user.type(screen.getByPlaceholderText('Pseudo'), 'nick');
    await user.click(screen.getByRole('checkbox', { name: /J'accepte la charte/ }));
    await user.click(screen.getByRole('checkbox', { name: /J'accepte la charte/ }));
    await user.click(screen.getByRole('button', { name: 'Inscription' }));

    await waitFor(() => {
      expect(store.select(userProfileSelectors.authenticatedUser)).toHaveProperty('id', 'userId');
    });
  });

  it('keeps the form state when changing the form type', async () => {
    store.dispatch(authenticationActions.setAuthenticationForm(AuthenticationFormType.login));

    const user = render(<AuthenticationForm onClose={mockFn()} />);

    await user.type(screen.getByPlaceholderText('Email'), 'user@domain.tld');

    store.dispatch(authenticationActions.setAuthenticationForm(AuthenticationFormType.signup));
    user.rerender(<AuthenticationForm onClose={mockFn()} />);

    expect(screen.getByPlaceholderText('Email')).toHaveValue('user@domain.tld');
  });
});
