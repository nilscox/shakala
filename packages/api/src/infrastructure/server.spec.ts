import expect from '@nilscox/expect';
import { StubConfigAdapter, StubLoggerAdapter, TOKENS } from '@shakala/common';
import { describe, it } from 'vitest';

import { container } from '../container';
import { API_TOKENS } from '../tokens';

declare global {
  const fetch: (url: string) => Promise<unknown>;
}

describe('[intg] Server', () => {
  it('starts an HTTP server on a given host and port', async () => {
    const config = new StubConfigAdapter({
      app: { host: 'localhost', port: 4242 },
    });

    const logger = new StubLoggerAdapter();

    container.bind(TOKENS.config).toConstant(config);
    container.bind(TOKENS.logger).toConstant(logger);

    const server = container.get(API_TOKENS.server);

    await server.listen();
    await expect(fetch('http://localhost:4242')).toResolve();

    await server.close();
    await expect(fetch('http://localhost:4242')).toReject();
  });
});
