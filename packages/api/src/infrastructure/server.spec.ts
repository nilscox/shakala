import expect from '@nilscox/expect';
import { describe, it } from 'vitest';

import { container } from '../container';
import { API_TOKENS } from '../tokens';

declare global {
  const fetch: (url: string) => Promise<unknown>;
}

describe('[intg] Server', () => {
  it('starts an HTTP server on a given host and port', async () => {
    const server = container.get(API_TOKENS.server);

    await server.listen('localhost', 4242);

    await expect(fetch('http://localhost:4242')).toResolve();

    await server.close();

    await expect(fetch('http://localhost:4242')).toReject();
  });
});
