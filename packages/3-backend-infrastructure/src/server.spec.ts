import { StubConfigService, TestConfigService } from './infrastructure/services/config.service';
import { MockLoggerService } from './infrastructure/services/mock-logger.service';
import { TestServer } from './test';

describe('Server', () => {
  it(
    'starts the server on a given port number',
    async () => {
      const server = new TestServer();

      server.overrideServices({
        loggerService: new MockLoggerService(),
        configService: new TestConfigService({
          app: { port: 4242 },
        }),
      });

      await server.init();
      await server.reset();

      await server.start();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore fetch should be available in node@18
      const response = await fetch('http://localhost:4242/healthcheck');

      expect(response.ok).toBe(true);
      expect(await response.json()).toEqual({ api: true, database: true });

      await server.close();
    },
    10 * 1000,
  );

  it(
    'returns a set-cookie header',
    async () => {
      const server = new TestServer();
      const agent = server.agent();

      server.overrideServices({
        loggerService: new MockLoggerService(),
        configService: new StubConfigService({
          app: { trustProxy: true },
          session: { secure: true },
        }),
      });

      await server.init();
      await server.reset();

      const response = await agent.get('/auth/me').set('X-Forwarded-Proto', 'https');

      expect(response.headers).toHaveProperty('set-cookie');

      await server.close();
    },
    10 * 1000,
  );
});
