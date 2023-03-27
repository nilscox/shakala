import { RouterPort } from './router.port';

export class StubRouterAdapter implements RouterPort {
  url = new URL('/');

  get pathname() {
    return this.url.pathname;
  }

  navigate(url: string): void {
    this.url = new URL(url);
  }
}
