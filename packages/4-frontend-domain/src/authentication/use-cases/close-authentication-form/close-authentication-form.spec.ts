import { TestStore } from '../../../test';
import { AuthenticationType } from '../../authentication.types';

import { closeAuthenticationForm } from './close-authentication-form';

describe('closeAuthenticationForm', () => {
  const store = new TestStore();

  beforeEach(() => {
    store.routerGateway.currentAuthenticationForm = AuthenticationType.login;
  });

  it('removes the authentication form state from the url', () => {
    store.dispatch(closeAuthenticationForm());

    expect(store.routerGateway.currentAuthenticationForm).toBeUndefined();
  });
});
