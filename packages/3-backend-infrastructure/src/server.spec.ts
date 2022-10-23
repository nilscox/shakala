import { StubConfigAdapter } from './infrastructure';
import { MockLoggerAdapter } from './infrastructure/test';
import { TestServer } from './test';

describe('Server', function () {
  this.slow(5 * 1000);
  this.timeout(10 * 1000);

  it('starts the server on a given port number', async () => {
    const server = new TestServer();

    server.override({
      logger: new MockLoggerAdapter(),
      config: new StubConfigAdapter({
        app: { port: 4242 },
      }).withEnvDatabase(),
    });

    await server.init();
    await server.reset();

    await server.start();

    // @ts-expect-error fetch is available in node@18
    const response = await fetch('http://localhost:4242/healthcheck');

    expect(response.ok).toBe(true);
    expect(await response.json()).toEqual({ api: true, database: true });

    await server.close();
  });

  it('returns a set-cookie header', async () => {
    const server = new TestServer();
    const agent = server.agent();

    server.override({
      logger: new MockLoggerAdapter(),
      config: new StubConfigAdapter({
        app: { trustProxy: true },
        session: { secure: true },
      }).withEnvDatabase(),
    });

    await server.init();
    await server.reset();

    const response = await agent.get('/auth/me').set('X-Forwarded-Proto', 'https');

    expect(response.headers).toHaveProperty('set-cookie');

    await server.close();
  });

  it('allows to read the Pagination-Total header', async () => {
    const server = new TestServer();
    const agent = server.agent();

    server.override({
      logger: new MockLoggerAdapter(),
      config: new StubConfigAdapter().withEnvDatabase(),
    });

    await server.init();

    const response = await agent.get('/healthcheck');

    expect(response.headers).toHaveProperty('access-control-expose-headers', 'Pagination-Total');

    await server.close();
  });
});
