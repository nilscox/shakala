import { AuthorizationError, AuthorizationErrorReason } from '@shakala/shared';

import { createTestStore, TestStore } from '../../../test-store';

import { handleAuthorizationError } from './handle-authorization-error';

describe('handleAuthorizationError', () => {
  let store: TestStore;

  beforeEach(() => {
    store = createTestStore();
  });

  const execute = async (error: Error, action?: string) => {
    return store.dispatch(handleAuthorizationError(error, action));
  };

  it('shows an error notification when the error is an authorization error', async () => {
    await execute(new AuthorizationError(AuthorizationErrorReason.emailValidationRequired));

    expect(store.snackbarGateway).toHaveSnack(
      'error',
      'Vous devez valider votre adresse email avant de pouvoir effectuer cette action.',
    );
  });

  it('shows an error notification with a custom action', async () => {
    await execute(
      new AuthorizationError(AuthorizationErrorReason.emailValidationRequired),
      'aller à la plage',
    );

    expect(store.snackbarGateway).toHaveSnack(
      'error',
      'Vous devez valider votre adresse email avant de pouvoir aller à la plage.',
    );
  });

  it('returns true when the error is an authorization error', async () => {
    expect(await execute(new AuthorizationError('youShallNotPass' as AuthorizationErrorReason))).toBe(true);
  });

  it('displays a fallback error message when the error is not known', async () => {
    await execute(new AuthorizationError('youShallNotPass' as AuthorizationErrorReason));

    expect(store.snackbarGateway).toHaveSnack(
      'error',
      "Vous n'avez pas les autorisations nécessaires pour effectuer cette action.",
    );
  });

  it('returns false when the error is not an authorization error', async () => {
    expect(await execute(new Error('nope'))).toBe(false);
  });
});
