import { AuthenticationGateway } from '../authentication/authentication.gateway';
import { LoggerGateway } from '../interfaces/logger.gateway';
import { RemoveListener, RouterGateway } from '../interfaces/router.gateway';
import { SnackbarGateway } from '../interfaces/snackbar.gateway';
import { TimerGateway } from '../interfaces/timer.gateway';
import { createStore, Dependencies, Selector } from '../store';
import { ThreadGateway } from '../thread/thread.gateway';

import { mockFn } from './mock-fn';

class MockSnackbarGateway implements SnackbarGateway {
  success = mockFn<SnackbarGateway['success']>();
  error = mockFn<SnackbarGateway['error']>();
  warning = mockFn<SnackbarGateway['warning']>();
}

class MockLoggerGateway implements LoggerGateway {
  warn = mockFn<LoggerGateway['warn']>();
}

class StubRouterGateway implements RouterGateway {
  private queryParams = new Map<string, string>();
  private locationChangeListener?: () => void;

  private _pathname = '/';

  get pathname() {
    return this._pathname;
  }

  set pathname(pathname: string) {
    this._pathname = pathname;
    this.triggerLocationChange();
  }

  navigate(to: string): void {
    this.pathname = to;
  }

  getQueryParam(key: string): string | undefined {
    return this.queryParams.get(key);
  }

  setQueryParam(key: string, value: string): void {
    this.queryParams.set(key, value);
    this.triggerLocationChange();
  }

  removeQueryParam(key: string): void {
    this.queryParams.delete(key);
    this.triggerLocationChange();
  }

  onLocationChange(listener: () => void): RemoveListener {
    this.locationChangeListener = listener;

    return () => delete this.locationChangeListener;
  }

  triggerLocationChange() {
    this.locationChangeListener?.();
  }
}

class FakeTimerGateway implements TimerGateway {
  private timeoutCb?: () => void;

  setTimeout(cb: () => void): () => void {
    this.timeoutCb = cb;

    return () => {
      delete this.timeoutCb;
    };
  }

  invokeTimeout() {
    this.timeoutCb?.();
    delete this.timeoutCb;
  }
}

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
  readonly snackbarGateway = new MockSnackbarGateway();
  readonly loggerGateway = new MockLoggerGateway();
  readonly routerGateway = new StubRouterGateway();
  readonly timerGateway = new FakeTimerGateway();
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
