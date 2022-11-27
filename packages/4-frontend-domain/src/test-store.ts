import { Middleware } from 'redux';
import Sinon from 'sinon';

import { LoggerGateway } from './gateways/logger-gateway';
import { AuthenticatedUser, userProfileActions, userProfileSelectors } from './modules/user-account';
import { AppSelector, AppStore, AppThunk, createStore } from './store';
import { createStubDependencies, StubDependencies } from './stubs';

export class MockLoggerGateway implements LoggerGateway {
  error = Sinon.mock();
}

export interface TestStore extends StubDependencies, AppStore {
  select<Params extends unknown[], Result>(selector: AppSelector<Params, Result>, ...params: Params): Result;
  testLoadingState(thunk: AppThunk<Promise<unknown>>, selector: AppSelector<[], boolean>): Promise<void>;
  logActions(log?: boolean): void;
  logState(): void;
  user: AuthenticatedUser | null;
}

export const createTestStore = (): TestStore => {
  const deps = createStubDependencies();

  let logActions = false;

  const logActionsMiddleware: Middleware = () => (next) => (action) => {
    if (logActions) {
      console.dir(action, { depth: null });
    }

    return next(action);
  };

  const store = createStore(deps, undefined, [logActionsMiddleware]);

  return {
    ...deps,
    ...store,

    select<Params extends unknown[], Result>(selector: AppSelector<Params, Result>, ...params: Params) {
      return selector(this.getState(), ...params);
    },

    async testLoadingState(thunk: AppThunk<Promise<unknown>>, selector: AppSelector<[], boolean>) {
      expect(this.select(selector)).toBe(false);

      const promise = this.dispatch(thunk);

      expect(this.select(selector)).toBe(true);
      await promise;
      expect(this.select(selector)).toBe(false);
    },

    logActions(log = true) {
      logActions = log;
    },

    logState() {
      console.dir(store.getState(), { depth: null });
    },

    get user(): AuthenticatedUser | null {
      return this.select(userProfileSelectors.authenticatedUser);
    },

    set user(user: AuthenticatedUser | null) {
      this.dispatch(userProfileActions.setAuthenticatedUser(user));
    },
  };
};
