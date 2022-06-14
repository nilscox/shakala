import EventEmitter from 'events';

import { RouterGateway, LocationChange, RemoveListener } from 'frontend-domain';
import { Location, NavigateFunction } from 'react-router-dom';

export class ReactRouterGateway extends EventEmitter implements RouterGateway {
  constructor(public location: Location, public navigate: NavigateFunction) {
    super();
  }

  get queryParams() {
    return new URLSearchParams(this.location.search);
  }

  getQueryParam(key: string): string | undefined {
    return this.queryParams.get(key) ?? undefined;
  }

  removeQueryParam(key: string): void {
    const params = this.queryParams;

    params.delete(key);
    this._navigate(this.location.pathname, params);
  }

  private _navigate(pathname: string, queryParams = this.queryParams) {
    setTimeout(() => this.navigate(pathname + '?' + queryParams.toString()), 0);
  }

  onLocationChange(listener: () => void): RemoveListener {
    this.addListener(LocationChange, listener);

    return () => this.removeListener(LocationChange, listener);
  }
}
