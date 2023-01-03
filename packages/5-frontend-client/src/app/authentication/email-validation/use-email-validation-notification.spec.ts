import { createStubFunction, routerActions, routerSelectors } from '@shakala/frontend-domain';
import { TestStore, createTestStore } from '@shakala/frontend-domain/test';

import { createTestRenderer, TestRenderer } from '../../../utils/test-renderer';

import { useEmailValidationNotification } from './use-email-validation-notification';

describe('useEmailValidationNotification', () => {
  let store: TestStore;
  let render: TestRenderer;

  const success = createStubFunction();
  const error = createStubFunction();

  beforeEach(() => {
    store = createTestStore();
    render = createTestRenderer().withStore(store);

    success.return(undefined);
    error.return(undefined);
  });

  const setEmailValidationStatus = (status: string) => {
    store.dispatch(routerActions.setQueryParam(['validate-email', status]));
  };

  it('shows a success notification when the email was correctly validated', () => {
    setEmailValidationStatus('success');
    render.hook(() => useEmailValidationNotification(success, error));

    expect(success.lastCall).toEqual(['Votre adresse email a bien été validée. Bienvenue ! 🎉']);
  });

  it('removes the validate-email search param', () => {
    setEmailValidationStatus('success');
    render.hook(() => useEmailValidationNotification(success, error));

    expect(store.select(routerSelectors.queryParam, 'validate-email')).toBe(undefined);
  });

  it('shows an error notification when the token is invalid', () => {
    setEmailValidationStatus('invalid-token');
    render.hook(() => useEmailValidationNotification(success, error));

    expect(error.lastCall).toEqual([
      "Le lien que vous avez utilisé n'est pas valide, votre adresse email n'a pas été validée.",
    ]);
  });

  it('shows an error notification when the email address was already validated', () => {
    setEmailValidationStatus('already-validated');
    render.hook(() => useEmailValidationNotification(success, error));

    expect(error.lastCall).toEqual(['Votre adresse email a déjà été validée.']);
  });

  it('shows an fallback error notification when the error is not known', () => {
    setEmailValidationStatus('server-crashed');
    render.hook(() => useEmailValidationNotification(success, error));

    expect(error.lastCall).toEqual([
      "Quelque chose s'est mal passé, votre adresse email n'a pas été validée.",
    ]);
  });
});
