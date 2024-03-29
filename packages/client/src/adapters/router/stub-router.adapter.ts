import { stub } from '@shakala/shared';

import { RouterPort } from './router.port';

const baseUrl = 'http://localhost';

export class StubRouterAdapter implements RouterPort {
  url = new URL('/', baseUrl);

  get pathname() {
    return this.url.pathname;
  }

  async navigate(url: string): Promise<void> {
    this.url = new URL(url, baseUrl);
  }

  onHashChange = stub();
}
