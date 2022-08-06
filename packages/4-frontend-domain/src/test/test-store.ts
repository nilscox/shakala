import { Middleware } from '@reduxjs/toolkit';

import { AuthenticationGateway } from '../authentication/authentication.gateway';
import { DateGateway } from '../interfaces/date.gateway';
import { LoggerGateway } from '../interfaces/logger.gateway';
import { RemoveListener, RouterGateway } from '../interfaces/router.gateway';
import { SnackbarGateway } from '../interfaces/snackbar.gateway';
import { TimerGateway } from '../interfaces/timer.gateway';
import { createStore, Dependencies, Dispatch, Selector, Store } from '../store';
import { ThreadGateway } from '../thread/thread.gateway';

import { mockFn } from './mock-fn';

class StubDateGateway implements DateGateway {
  private _now = new Date();

  now(): Date {
    return this._now;
  }

  setNow(now: Date) {
    this._now = now;
  }
}

class MockSnackbarGateway implements SnackbarGateway {
  success = mockFn<SnackbarGateway['success']>();
  error = mockFn<SnackbarGateway['error']>();
  warning = mockFn<SnackbarGateway['warning']>();
}

class MockLoggerGateway implements LoggerGateway {
  warn = mockFn<LoggerGateway['warn']>();
  error = mockFn<LoggerGateway['error']>();
}

class StubRouterGateway implements RouterGateway {
  private queryParams = new Map<string, string>();
  private locationChangeListener?: () => void;

  private _pathname = '/';

  constructor() {
    beforeEach(() => {
      this.queryParams.clear();
      this.locationChangeListener = undefined;
      this.pathname = '/';
    });
  }

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
  getById = mockFn<ThreadGateway['getById']>();
  getLast = mockFn<ThreadGateway['getLast']>();
  createThread = mockFn<ThreadGateway['createThread']>();
  getComments = mockFn<ThreadGateway['getComments']>();
  createComment = mockFn<ThreadGateway['createComment']>();
  createReply = mockFn<ThreadGateway['createReply']>();
  editComment = mockFn<ThreadGateway['editComment']>();
  setReaction = mockFn<ThreadGateway['setReaction']>();
}

export class TestStore implements Dependencies {
  readonly dateGateway = new StubDateGateway();
  readonly snackbarGateway = new MockSnackbarGateway();
  readonly loggerGateway = new MockLoggerGateway();
  readonly routerGateway = new StubRouterGateway();
  readonly timerGateway = new FakeTimerGateway();
  readonly authenticationGateway = new MockAuthenticationGateway();
  readonly threadGateway = new MockThreadGateway();

  private _logActions = false;

  public logActions(log = true) {
    this._logActions = log;
  }

  private logActionsMiddleware: Middleware = () => (next) => (action) => {
    if (this._logActions) {
      console.dir(action, { depth: null });
    }

    return next(action);
  };

  private reduxStore!: Store;

  constructor() {
    beforeEach(() => {
      this.reduxStore = createStore(this, [this.logActionsMiddleware]);
    });
  }

  getState() {
    return this.reduxStore.getState();
  }

  dispatch(...args: Parameters<Dispatch>) {
    return this.reduxStore.dispatch(...args);
  }

  select<Params extends unknown[], Result>(selector: Selector<Params, Result>, ...params: Params) {
    return selector(this.getState(), ...params);
  }

  logState() {
    console.dir(this.getState(), { depth: null });
  }

  getReduxStore() {
    return this.reduxStore;
  }
}
