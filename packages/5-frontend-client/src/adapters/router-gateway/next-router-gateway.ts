import EventEmitter from 'events';

import { AuthenticationType, LocationChange, RemoveListener, RouterGateway } from 'frontend-domain';

export class NextRouterGateway extends EventEmitter implements RouterGateway {
  private _pathname = '/';
  private _queryParams = new URLSearchParams();

  public navigate: (url: string) => void = () => {};

  set pathname(pathname: string) {
    this._pathname = pathname;
    this.emit(LocationChange);
  }

  get pathname() {
    return this._pathname;
  }

  set queryParams(queryParams: URLSearchParams) {
    this._queryParams = queryParams;
    this.emit(LocationChange);
  }

  get queryParams() {
    return this._queryParams;
  }

  getQueryParam(key: string): string | undefined {
    return this._queryParams.get(key) ?? undefined;
  }

  setQueryParam(key: string, value: string): void {
    const params = this._queryParams;

    params.set(key, value);
    this._navigate(this.pathname, params);
  }

  removeQueryParam(key: string): void {
    const params = this._queryParams;

    params.delete(key);
    this._navigate(this.pathname, params);
  }

  private navigateTimeout?: number;

  private _navigate(pathname: string, queryParams = this._queryParams) {
    if (this.navigateTimeout) {
      window.clearTimeout(this.navigateTimeout);
      this.navigateTimeout = undefined;
    }

    this.navigateTimeout = window.setTimeout(() => {
      this.navigateTimeout = undefined;
      this.navigate(`${pathname}?${queryParams}`.replace(/\?$/, ''));
    }, 0);
  }

  onLocationChange(listener: () => void): RemoveListener {
    this.addListener(LocationChange, listener);

    return () => this.removeListener(LocationChange, listener);
  }

  redirectAfterAuthentication(): void {
    const next = this.getQueryParam('next');

    if (!next) {
      return;
    }

    this._navigate(next);
  }

  get currentAuthenticationForm(): AuthenticationType | undefined {
    switch (this.getQueryParam('auth')) {
      case 'login':
        return AuthenticationType.login;
      case 'register':
        return AuthenticationType.signup;
      case 'email-login':
        return AuthenticationType.emailLogin;
      default:
        return undefined;
    }
  }

  set currentAuthenticationForm(form: AuthenticationType | undefined) {
    if (form) {
      this.setQueryParam('auth', form === AuthenticationType.signup ? 'register' : form);
    } else {
      this.removeQueryParam('auth');
    }
  }
}
