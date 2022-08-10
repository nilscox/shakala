import { LoginBodyDto, SignupBodyDto } from 'shared';

import { TestConfigService } from '../../infrastructure/services/config.service';
import { MockLoggerService } from '../../infrastructure/services/mock-logger.service';
import { TestServer } from '../../test';

describe('Authentication e2e', () => {
  const server = new TestServer();
  const agent = server.agent();

  server.overrideServices({
    loggerService: new MockLoggerService(),
    configService: new TestConfigService(),
  });

  beforeAll(async () => {
    await server.init();
  });

  beforeEach(async () => {
    await server.reset();
  });

  test('as a user, I can sign up, log out and and log back in', async () => {
    const signup = async () => {
      const body: SignupBodyDto = { nick: 'nick', email: 'user@domain.tld', password: 'p4ssw0rd' };

      await agent.post('/auth/signup').send(body).expect(201);
    };

    const logout = async () => {
      await agent.post('/auth/logout').expect(204);
    };

    const login = async () => {
      const loginBody: LoginBodyDto = { email: 'user@domain.tld', password: 'p4ssw0rd' };

      await agent.post('/auth/login').send(loginBody).expect(200);
    };

    await server.init();

    await signup();
    await logout();
    await login();
  });
});
