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
    this._queryParams.set(key, value);
    this.applyNavigation();
  }

  removeQueryParam(key: string): void {
    this._queryParams.delete(key);
    this.applyNavigation();
  }

  private navigateTimeout?: number;

  private applyNavigation() {
    if (this.navigateTimeout) {
      window.clearTimeout(this.navigateTimeout);
      this.navigateTimeout = undefined;
    }

    this.navigateTimeout = window.setTimeout(() => {
      this.navigateTimeout = undefined;
      this.navigate(`${this.pathname}?${this.queryParams}`.replace(/\?$/, ''));
      this.emit(LocationChange);
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

    this.pathname = next;
    this.removeQueryParam('next');
    this.applyNavigation();
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
