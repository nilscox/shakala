import expect from '@nilscox/expect';
import { stub } from '@shakala/shared';
import { cleanup, screen } from '@testing-library/react';
import { afterEach, describe, it } from 'vitest';

import { setupTest } from '~/utils/setup-test';

import { AuthenticationForm } from './authentication-form';
import { AuthForm } from './types';

// todo: fix authentication tests
describe.skip('AuthenticationForm', () => {
  const { render, setSearchParam, adapters } = setupTest();

  afterEach(cleanup);

  it('fills and submits the sign in form', async () => {
    setSearchParam('auth', AuthForm.signIn);

    const user = render(<AuthenticationForm onClose={stub()} />);

    await user.type(screen.getByPlaceholderText('Email'), 'user@domain.tld');
    await user.type(screen.getByPlaceholderText('Mot de passe'), 'password');
    await user.click(screen.getByRole('button', { name: 'Connexion' }));

    expect(await screen.findByText('Vous êtes maintenant connecté·e')).toBeVisible();

    expect(adapters.authentication.signIn).calledWith('user@domain.tld', 'password');
  });

  it('fills and submits the sign up form', async () => {
    setSearchParam('auth', AuthForm.signUp);

    const user = render(<AuthenticationForm onClose={stub()} />);

    await user.type(screen.getByPlaceholderText('Email'), 'user@domain.tld');
    await user.type(screen.getByPlaceholderText('Mot de passe'), 'password');
    await user.type(screen.getByPlaceholderText('Pseudo'), 'nick');
    await user.click(screen.getByRole('checkbox', { name: /J'accepte la charte/ }));
    await user.click(screen.getByRole('checkbox', { name: /J'accepte la charte/ }));
    await user.click(screen.getByRole('button', { name: 'Inscription' }));

    expect(await screen.findByText('Vous êtes maintenant connecté·e')).toBeVisible();

    expect(adapters.authentication.signUp).calledWith('nick', 'user@domain.tld', 'password');
  });

  it('keeps the form state when changing the form type', async () => {
    setSearchParam('auth', AuthForm.signIn);

    const user = render(<AuthenticationForm onClose={stub()} />);

    await user.type(screen.getByPlaceholderText('Email'), 'user@domain.tld');

    setSearchParam('auth', AuthForm.signUp);

    user.rerender(<AuthenticationForm onClose={stub()} />);

    expect(screen.getByPlaceholderText('Email')).toHaveValue('user@domain.tld');
  });

  it('redirects after authentication succeeded', async () => {
    setSearchParam('auth', AuthForm.signIn);
    setSearchParam('next', '/profil');

    const user = render(<AuthenticationForm onClose={stub()} />);

    await user.click(screen.getByRole('button', { name: 'Connexion' }));

    expect(adapters.router.url.pathname).toEqual('/profil');
    expect(adapters.router.url.searchParams.get('next')).toBe(null);
  });
});
