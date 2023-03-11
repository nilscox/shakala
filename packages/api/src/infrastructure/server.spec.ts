import expect from '@nilscox/expect';
import { StubConfigAdapter, TOKENS } from '@shakala/common';
import { describe, it } from 'vitest';

import { container } from '../container';
import { API_TOKENS } from '../tokens';

import { Application } from './application';

describe('[intg] Server', () => {
  it('starts an HTTP server on a given host and port', async () => {
    await new Application().init({
      common: { logger: 'stub', buses: 'stub', generator: 'stub' },
      email: { emailSender: 'stub' },
      notification: { repositories: 'memory' },
      thread: { repositories: 'memory' },
      user: { repositories: 'memory' },
      api: { server: 'prod' },
    });

    const config = new StubConfigAdapter({
      app: { host: 'localhost', port: 4242 },
    });

    container.bind(TOKENS.config).toConstant(config);

    const server = container.get(API_TOKENS.server);

    await server.listen();
    await expect(fetch('http://localhost:4242')).toResolve();

    await server.close();
    await expect(fetch('http://localhost:4242')).toReject();
  });
});
