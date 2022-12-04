import { createTestStore, TestStore } from '../../../test-store';
import { createAuthUser } from '../../user-account';
import { authenticationSelectors } from '../authentication.selectors';
import { AuthenticationFormType } from '../authentication.types';

import {
  closeAuthenticationForm,
  requireAuthentication,
  setAuthenticationForm,
} from './require-authentication';

describe('requireAuthentication', () => {
  let store: TestStore;

  beforeEach(() => {
    store = createTestStore();
  });

  it('returns the authenticated user', () => {
    const user = createAuthUser();

    store.user = user;

    const result = store.dispatch(requireAuthentication());

    expect(result).toEqual(user);
  });

  it('opens the authentication dialog when the user is not authenticated', () => {
    const result = store.dispatch(requireAuthentication());

    expect(result).toBe(null);

    expect(store.select(authenticationSelectors.currentForm)).toBe(AuthenticationFormType.login);
  });

  it('closes the authentication form', () => {
    store.dispatch(setAuthenticationForm(AuthenticationFormType.login));

    store.dispatch(closeAuthenticationForm());

    expect(store.select(authenticationSelectors.isModalOpen)).toBe(false);
  });
});
