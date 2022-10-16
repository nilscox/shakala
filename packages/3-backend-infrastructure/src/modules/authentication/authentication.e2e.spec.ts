import { InMemoryEmailSenderAdapter } from 'backend-application';
import { LoginBodyDto, SignupBodyDto } from 'shared';

import { MockLoggerAdapter, StubConfigAdapter } from '../../infrastructure';
import { TestServer } from '../../test';

describe('Authentication e2e', function () {
  this.slow(1000);

  const server = new TestServer();
  const agent = server.agent();

  const apiBaseUrl = 'https://api.url';
  const emailSender = new InMemoryEmailSenderAdapter();

  server.override({
    logger: new MockLoggerAdapter(),
    config: new StubConfigAdapter({ app: { apiBaseUrl } }).withEnvDatabase(),
    emailSender,
  });

  before(async () => {
    await server.init();
  });

  beforeEach(async () => {
    await server.reset();
  });

  it('as a user, I can sign up, log out and and log back in', async () => {
    const signup = async () => {
      const body: SignupBodyDto = { nick: 'nick', email: 'user@domain.tld', password: 'p4ssw0rd' };

      await agent.post('/auth/signup').send(body).expect(201);
    };

    const validateEmail = async () => {
      const match = emailSender.lastSentEmail?.body.text.match(/(http.+)\n/);
      const endpoint = match?.at(1)?.replace(apiBaseUrl, '') as string;

      await agent.get(endpoint).expect(307);
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
    await validateEmail();
    await logout();
    await login();
  });
});
