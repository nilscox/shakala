import { describe, it } from 'node:test';

import expect from '@nilscox/expect';
import { StubGeneratorAdapter } from '@shakala/common';

import { StubCommandBus } from '../tests/stub-command-bus';

import { Server } from './server';

declare global {
  const fetch: (url: string) => Promise<unknown>;
}

describe('[intg] Server', () => {
  it('starts an HTTP server on a given host and port', async () => {
    const server = new Server(new StubGeneratorAdapter(), new StubCommandBus());

    await server.listen('localhost', 4242);

    await expect(fetch('http://localhost:4242')).toResolve();

    await server.close();

    await expect(fetch('http://localhost:4242')).toReject();
  });
});
