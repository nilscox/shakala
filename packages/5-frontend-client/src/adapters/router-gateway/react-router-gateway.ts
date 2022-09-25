import EventEmitter from 'events';

import { RouterGateway, LocationChange, RemoveListener, AuthenticationType } from 'frontend-domain';
import { Location, NavigateFunction } from 'react-router-dom';

export class ReactRouterGateway extends EventEmitter implements RouterGateway {
  private queryParams: URLSearchParams;

  constructor(private _location: Location, public navigate: NavigateFunction) {
    super();

    this.queryParams = new URLSearchParams(this.location.search);
  }

  set location(location: Location) {
    this._location = location;
    this.queryParams = new URLSearchParams(this.location.search);

    this.emit(LocationChange);
  }

  get location() {
    return this._location;
  }

  getQueryParam(key: string): string | undefined {
    return this.queryParams.get(key) ?? undefined;
  }

  setQueryParam(key: string, value: string): void {
    const params = this.queryParams;

    params.set(key, value);
    this._navigate(this.location.pathname, params);
  }

  removeQueryParam(key: string): void {
    const params = this.queryParams;

    params.delete(key);
    this._navigate(this.location.pathname, params);
  }

  private navigateTimeout?: number;

  private _navigate(pathname: string, queryParams = this.queryParams) {
    if (this.navigateTimeout) {
      window.clearTimeout(this.navigateTimeout);
      this.navigateTimeout = undefined;
    }

    this.navigateTimeout = window.setTimeout(() => {
      this.navigateTimeout = undefined;
      this.navigate(pathname + '?' + queryParams.toString());
    }, 0);
  }

  onLocationChange(listener: () => void): RemoveListener {
    this.addListener(LocationChange, listener);

    return () => this.removeListener(LocationChange, listener);
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
