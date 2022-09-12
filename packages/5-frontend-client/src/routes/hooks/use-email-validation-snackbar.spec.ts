import { createMemoryHistory } from 'history';

import { useSnackbar } from '~/components/elements/snackbar';
import { UseSnackbarResult } from '~/components/elements/snackbar/use-snackbar';
import { TestRenderer } from '~/test/render';

import { useEmailValidationNotification } from './use-email-validation-snackbar';

vi.mock('~/components/elements/snackbar');

describe('useEmailValidationNotification', () => {
  const createHistory = (emailValidationStatus: string) => {
    return createMemoryHistory({
      initialEntries: ['/?' + new URLSearchParams({ 'validate-email': emailValidationStatus })],
    });
  };

  const mockUseSnackbar = (mocks?: Partial<UseSnackbarResult>) => {
    vi.mocked(useSnackbar).mockReturnValue({
      success: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
      error: vi.fn(),
      ...mocks,
    });
  };

  it('shows a success notification when the email was correctly validated', () => {
    const success = vi.fn();

    mockUseSnackbar({ success });

    const { renderHook } = new TestRenderer().withMemoryRouter(createHistory('success'));

    renderHook(() => useEmailValidationNotification());

    expect(success).toHaveBeenCalledWith('Votre adresse email a bien été validée. Bienvenue ! 🎉');
  });

  it('removes the validate-email search param', () => {
    const history = createHistory('success');

    mockUseSnackbar();

    const { renderHook } = new TestRenderer().withMemoryRouter(history);

    renderHook(() => useEmailValidationNotification());

    expect(history.location.search).toEqual('');
  });

  const testError = (emailValidationStatus: string, expectedMessage: string) => {
    const history = createHistory(emailValidationStatus);
    const error = vi.fn();

    mockUseSnackbar({ error });

    const { renderHook } = new TestRenderer().withMemoryRouter(history);

    renderHook(() => useEmailValidationNotification());

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
