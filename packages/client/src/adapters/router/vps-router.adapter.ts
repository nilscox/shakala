import { navigate } from 'vite-plugin-ssr/client/router';

import { NavigateOptions, RouterPort } from './router.port';

export class VPSRouterAdapter implements RouterPort {
  async navigate(url: string, options?: NavigateOptions): Promise<void> {
    await navigate(url, options);
  }

  get hash(): string {
    return window.location.hash.replace(/^#/, '');
  }

  onHashChange(cb: (hash: string) => void) {
    const listener = () => cb(this.hash);

    window.addEventListener('hashchange', listener);
    return () => window.removeEventListener('hashchange', listener);
  }
}
