import expect from '@nilscox/expect';
import { stub } from '@shakala/shared';
import { describe, it } from 'vitest';

import { StubRouterAdapter } from '~/adapters/router/stub-router.adapter';
import { container } from '~/app/container';
import { setupTest } from '~/utils/setup-test';

import { useEmailValidationNotification } from './use-email-validation-notification';

describe('useEmailValidationNotification', () => {
  const { renderHook, setSearchParam } = setupTest();
  const success = stub();
  const error = stub();

  const setEmailValidationStatus = (status: string) => {
    setSearchParam('validate-email', status);
  };

  it('shows a success notification when the email was correctly validated', () => {
    setEmailValidationStatus('success');
    renderHook(() => useEmailValidationNotification(success, error));

    expect(success).calledWith('Votre adresse email a bien été validée. Bienvenue ! 🎉');
  });

  it('removes the validate-email search param', () => {
    setEmailValidationStatus('success');
    renderHook(() => useEmailValidationNotification(success, error));

    const router = container.get(TOKENS.router) as StubRouterAdapter;
    expect(router.url.searchParams.get('validated-email')).toBe(null);
  });

  it('shows an error notification when the token is invalid', () => {
    setEmailValidationStatus('invalid-token');
    renderHook(() => useEmailValidationNotification(success, error));

    expect(error).calledWith(
      "Le lien que vous avez utilisé n'est pas valide, votre adresse email n'a pas été validée."
    );
  });

  it('shows an error notification when the email address was already validated', () => {
    setEmailValidationStatus('already-validated');
    renderHook(() => useEmailValidationNotification(success, error));

    expect(error).calledWith('Votre adresse email a déjà été validée.');
  });

  it('shows an fallback error notification when the error is not known', () => {
    setEmailValidationStatus('server-crashed');
    renderHook(() => useEmailValidationNotification(success, error));

    expect(error).calledWith("Quelque chose s'est mal passé, votre adresse email n'a pas été validée.");
  });
});
