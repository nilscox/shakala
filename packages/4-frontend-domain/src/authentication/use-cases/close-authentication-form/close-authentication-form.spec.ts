import { TestStore } from '../../../test';
import { setAuthenticationForm, setIsAuthenticationModalOpen } from '../../actions/authentication.actions';
import { AuthenticationType } from '../../authentication.types';
import {
  selectAuthenticationForm,
  selectAuthenticationFormUnsafe,
  selectIsAuthenticationModalOpen,
} from '../../selectors/authentication.selectors';

import { closeAuthenticationForm } from './close-authentication-form';

describe('closeAuthenticationForm', () => {
  const store = new TestStore();

  beforeEach(() => {
    store.dispatch(setIsAuthenticationModalOpen(true));
    store.dispatch(setAuthenticationForm(AuthenticationType.login));
    store.routerGateway.setQueryParam('auth', 'login');
  });

  it('sets the modal open flag to false', () => {
    store.dispatch(closeAuthenticationForm());

    expect(store.select(selectIsAuthenticationModalOpen)).toBe(false);
  });

  it('unsets the form after a timeout', () => {
    store.dispatch(closeAuthenticationForm());

    expect(store.select(selectAuthenticationForm)).toBeDefined();

    store.timerGateway.invokeTimeout();

    expect(store.select(selectAuthenticationFormUnsafe)).toBeUndefined();
    expect(store.routerGateway.getQueryParam('auth')).toBeUndefined();
  });
});
