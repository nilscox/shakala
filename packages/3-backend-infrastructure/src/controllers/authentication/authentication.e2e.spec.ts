import { Request } from 'supertest';

import { TestServer } from '../../test';

import { LoginBodySchema, SignupBodySchema } from './authentication.controller';

export const logResponse = (req: Request) => {
  req.on('response', (res) => console.log(res.body));
};

describe('Authentication e2e', () => {
  const server = new TestServer();
  const agent = server.agent();

  test('sign up, log out and and log back in', async () => {
    const signup = async () => {
      const body: SignupBodySchema = { nick: 'nick', email: 'user@domain.tld', password: 'p4ssw0rd' };

      await agent.post('/auth/signup').send(body).expect(201);
    };

    const logout = async () => {
      await agent.post('/auth/logout').expect(204);
    };

    const login = async () => {
      const loginBody: LoginBodySchema = { email: 'user@domain.tld', password: 'p4ssw0rd' };

      await agent.post('/auth/login').send(loginBody).expect(200);
    };

    await signup();
    await logout();
    await login();
  });
});
