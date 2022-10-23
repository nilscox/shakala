import { createMemoryHistory, MemoryHistory } from 'history';
import { mockFn } from 'shared/test';

import { TestRenderer } from '~/test/render';

import { useEmailValidationNotification } from './use-email-validation-notification';

describe('useEmailValidationNotification', () => {
  const createHistory = (emailValidationStatus: string) => {
    return createMemoryHistory({
      initialEntries: ['/?' + new URLSearchParams({ 'validate-email': emailValidationStatus })],
    });
  };

  const render = (history: MemoryHistory, { success = mockFn(), error = mockFn() } = {}) => {
    const { renderHook } = new TestRenderer().withMemoryRouter(history);

    renderHook(() => useEmailValidationNotification(success, error));
  };

  it('shows a success notification when the email was correctly validated', () => {
    const success = mockFn();

    render(createHistory('success'), { success });

    expect(success).toHaveBeenCalledWith('Votre adresse email a bien été validée. Bienvenue ! 🎉');
  });

  it('removes the validate-email search param', () => {
    const history = createHistory('success');

    render(history);

    expect(history.location.search).toEqual('');
  });

  const testError = (emailValidationStatus: string, expectedMessage: string) => {
    const error = mockFn();

    render(createHistory(emailValidationStatus), { error });

    expect(error).toHaveBeenCalledWith(expectedMessage);
  };

  it('shows an error notification when the token is invalid', () => {
    testError(
      'invalid-token',
      "Le lien que vous avez utilisé n'est pas valide, votre adresse email n'a pas été validée.",
    );
  });

  it('shows an error notification when the email address was already validated', () => {
    testError('already-validated', 'Votre adresse email a déjà été validée.');
  });

  it('shows an fallback error notification when the error is not known', () => {
    testError('server-crashed', "Quelque chose s'est mal passé, votre adresse email n'a pas été validée.");
  });
});
