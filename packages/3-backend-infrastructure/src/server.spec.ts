import { StubConfigService } from './infrastructure/services/config.service';
import { TestServer } from './test';

describe('Server', () => {
  it('returns a set-cookie header', async () => {
    const server = new TestServer();
    const agent = server.agent();

    server.overrideServices({
      configService: new StubConfigService({
        app: { trustProxy: true },
        session: { secure: true },
      }),
    });

    await server.init();

    const response = await agent.get('/auth/me').set('X-Forwarded-Proto', 'https');

    expect(response.headers).toHaveProperty('set-cookie');
  });
});
