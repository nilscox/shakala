import { TestStore } from '../test';
import { AuthorizationError } from '../types';

import { handleAuthorizationError } from './handle-authorization-error';

describe('handleAuthorizationError', () => {
  const store = new TestStore();

  const execute = async (error: Error, action?: string) => {
    return store.dispatch(handleAuthorizationError(error, action));
  };

  it('shows an error notification when the error is an authorization error', async () => {
    await execute(new AuthorizationError('emailValidationRequired'));

    expect(store.snackbarGateway.error).toHaveBeenCalledWith(
      'Vous devez valider votre adresse email avant de pouvoir effectuer cette action.',
    );
  });

  it('shows an error notification with a custom action', async () => {
    await execute(new AuthorizationError('emailValidationRequired'), 'aller à la plage');

    expect(store.snackbarGateway.error).toHaveBeenCalledWith(
      'Vous devez valider votre adresse email avant de pouvoir aller à la plage.',
    );
  });

  it('returns true when the error is an authorization error', async () => {
    expect(await execute(new AuthorizationError('youShallNotPass'))).toBe(true);
  });

  it('displays a fallback error message when the error is not known', async () => {
    await execute(new AuthorizationError('youShallNotPass'));

    expect(store.snackbarGateway.error).toHaveBeenCalledWith(
      "Vous n'avez pas les autorisations nécessaires pour effectuer cette action.",
    );
  });

  it('returns true when the error is not an authorization error', async () => {
    expect(await execute(new Error('nope'))).toBe(false);
  });
});
