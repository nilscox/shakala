import { AuthenticationGateway } from '../authentication/authentication.gateway';
import { createStore, Dependencies, Selector } from '../store';
import { ThreadGateway } from '../thread/thread.gateway';

import { mockFn } from './mock-fn';

class MockAuthenticationGateway implements AuthenticationGateway {
  fetchUser = mockFn<AuthenticationGateway['fetchUser']>();
  login = mockFn<AuthenticationGateway['login']>();
  signup = mockFn<AuthenticationGateway['signup']>();
  logout = mockFn<AuthenticationGateway['logout']>();
}

class MockThreadGateway implements ThreadGateway {
  getLast = mockFn<ThreadGateway['getLast']>();
}

export class TestStore implements Dependencies {
  readonly authenticationGateway = new MockAuthenticationGateway();
  readonly threadGateway = new MockThreadGateway();

  private reduxStore = createStore(this);

  constructor() {
    beforeEach(() => {
      this.reduxStore = createStore(this);
    });
  }

  getState() {
    return this.reduxStore.getState();
  }

  dispatch(...args: Parameters<typeof this.reduxStore.dispatch>) {
    return this.reduxStore.dispatch(...args);
  }

  select<Params extends unknown[], Result>(selector: Selector<Params, Result>, ...params: Params) {
    return selector(this.getState(), ...params);
  }
}
