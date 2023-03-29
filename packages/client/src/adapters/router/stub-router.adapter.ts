import { RouterPort } from './router.port';

const baseUrl = 'http://localhost';

export class StubRouterAdapter implements RouterPort {
  url = new URL('/', baseUrl);

  get pathname() {
    return this.url.pathname;
  }

  navigate(url: string): void {
    this.url = new URL(url, baseUrl);
  }
}
