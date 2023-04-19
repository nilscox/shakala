import expect from '@nilscox/expect';
import { screen } from '@testing-library/dom';
import { beforeEach, describe, it } from 'vitest';

import { StubRouterAdapter } from '~/adapters/router/stub-router.adapter';
import { container } from '~/app/container';
import { TOKENS } from '~/app/tokens';
import { mockHttpError, setupTest } from '~/utils/setup-test';

import { useValidateEmail } from './use-validate-email';

describe('useValidateEmail', () => {
  const { renderHook, setSearchParam, adapters } = setupTest();

  beforeEach(() => {
    setSearchParam('email-validation-token', 'token');
  });

  it('shows a success notification when the email was correctly validated', async () => {
    adapters.account.validateEmail.resolve();

    renderHook(() => useValidateEmail());

    expect(await screen.findByText('Votre adresse email a bien été validée. Bienvenue ! 🎉')).toBeVisible();
    expect(adapters.account.validateEmail).calledWith('token');
  });

  it('does not call the api when there is no email validation search parameter', () => {
    setSearchParam('email-validation-token', undefined);

    renderHook(() => useValidateEmail());

    expect(adapters.account.validateEmail).not.called();
  });

  it('removes the search parameter', () => {
    renderHook(() => useValidateEmail());

    const router = container.get(TOKENS.router) as StubRouterAdapter;
    expect(router.url.searchParams.get('email-validation-token')).toBe(null);
  });

  it('shows an error notification when the token is invalid', async () => {
    adapters.account.validateEmail.reject(mockHttpError({ code: 'InvalidEmailValidationTokenError' }));

    renderHook(() => useValidateEmail());

    expect(await screen.findByText("Le lien que vous avez utilisé n'est pas valide.")).toBeVisible();
  });

  it('shows an error notification when the email address was already validated', async () => {
    adapters.account.validateEmail.reject(mockHttpError({ code: 'EmailAlreadyValidatedError' }));

    renderHook(() => useValidateEmail());

    expect(await screen.findByText('Votre adresse email a déjà été validée.')).toBeVisible();
  });

  it('shows an fallback error notification when the error is not known', async () => {
    adapters.account.validateEmail.reject(mockHttpError({ code: 'oops' }));

    renderHook(() => useValidateEmail());

    expect(
      await screen.findByText("Quelque chose s'est mal passé, votre adresse email n'a pas été validée.")
    ).toBeVisible();
  });
});
