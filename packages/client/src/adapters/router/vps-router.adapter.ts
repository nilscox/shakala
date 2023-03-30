import { navigate } from 'vite-plugin-ssr/client/router';

import { RouterPort } from './router.port';

export class VPSRouterAdapter implements RouterPort {
  navigate(url: string): void {
    void navigate(url);
  }

  get hash(): string | undefined {
    if (window.location.hash === '') {
      return undefined;
    }

    return window.location.hash.replace(/^#/, '');
  }

  onHashChange(cb: (hash: string | undefined) => void) {
    const listener = () => cb(this.hash);

    window.addEventListener('hashchange', listener);
    return () => window.removeEventListener('hashchange', listener);
  }
}
