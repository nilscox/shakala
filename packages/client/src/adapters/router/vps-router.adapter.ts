import { navigate } from 'vite-plugin-ssr/client/router';

import { RouterPort } from './router.port';

export class VPSRouterAdapter implements RouterPort {
  navigate(url: string): void {
    void navigate(url);
  }
}
