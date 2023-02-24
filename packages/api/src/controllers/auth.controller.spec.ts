import assert from 'assert';
import { afterEach, beforeEach, describe, it } from 'node:test';

import { StubOf, stub, expect, StubGeneratorAdapter } from '@shakala/common';
import { SignUpBody, SignInBody } from '@shakala/shared';
import { checkUserPassword, createUser, InvalidCredentialsError } from '@shakala/user';
import * as request from 'supertest';

import { StubCommandBus } from '../tests/stub-command-bus';
import { TestServer } from '../tests/test-server';
import { jwt } from '../utils/jwt';

describe('[intg] auth controller', () => {
  describe('/auth/sign-up', () => {
    const route = '/auth/sign-up';
    let test: Test;
    let stubCreateUser: StubOf<typeof createUser>;

    beforeEach(() => {
      test = new Test();
      stubCreateUser = stub<typeof createUser>();
      test.commandBus.set(createUser, stubCreateUser);
      test.generator.nextId = 'id';
    });

    afterEach(() => test.cleanup());

    const payload: SignUpBody = {
      nick: 'mano',
      email: 'mano@domain.tld',
      password: 'password',
    };

    it('invokes the createUser command', async () => {
      await test.agent.post(route).send(payload).expect(201);

      expect(stubCreateUser).calledWith({
        nick: 'mano',
        email: 'mano@domain.tld',
        password: 'password',
      });
    });

    it("returns the created user's id", async () => {
      test.generator.nextId = 'generated-id';

      await test.agent.post(route).send(payload).expect(201).expect('generated-id');

      expect(stubCreateUser).calledWith({
        nick: 'mano',
        email: 'mano@domain.tld',
        password: 'password',
      });
    });

    it('sets a cookie with the authentication token', async () => {
      const response = await test.agent.post(route).send(payload).expect(201);

      const cookie = test.getCookie(response, 'token');

      expect(cookie).toHaveProperty('token', expect.any(String));
      expect(cookie).toHaveProperty('Max-Age', expect.any(String));
      expect(cookie).toHaveProperty('Path', '/');
      expect(cookie).toHaveProperty('SameSite', 'Strict');
      expect(cookie).toHaveProperty('Secure');
      expect(cookie).toHaveProperty('HttpOnly');

      expect<object>(test.getTokenPayload(response)).toHaveProperty('uid', 'user');
    });

    it('fails with status 400 when the payload is invalid', async () => {
      await test.agent.post(route).send({}).expect(400);
    });

    it('fails with status 401 when the user is already authenticated', async () => {
      const agent = test.server.as('userId');
      await agent.post(route).send(payload).expect(401);
    });
  });

  describe('/auth/sign-in', () => {
    const route = '/auth/sign-in';
    let test: Test;
    let stubCheckUserPassword: StubOf<typeof checkUserPassword>;

    beforeEach(() => {
      test = new Test();
      stubCheckUserPassword = stub<typeof checkUserPassword>();
      test.commandBus.set(checkUserPassword, stubCheckUserPassword);
    });

    afterEach(() => test.cleanup());

    const payload: SignInBody = {
      email: 'mano@domain.tld',
      password: 'password',
    };

    it('succeeds when the checkUserPassword command succeeds', async () => {
      await test.agent.post(route).send(payload).expect(204);

      expect(stubCheckUserPassword).calledWith({
        email: 'mano@domain.tld',
        password: 'password',
      });
    });

    it('sets a cookie with the authentication token', async () => {
      const response = await test.agent.post(route).send(payload).expect(204);

      expect<object>(test.getTokenPayload(response)).toHaveProperty('uid', 'user');
    });

    it('fails with status 401 when the password check fails', async () => {
      stubCheckUserPassword.reject(new InvalidCredentialsError());

      await test.agent.post(route).send(payload).expect(401);
    });

    it('fails with status 400 when the payload is invalid', async () => {
      await test.agent.post(route).send({}).expect(400);
    });

    it('fails with status 401 when the user is already authenticated', async () => {
      const agent = test.server.as('userId');
      await agent.post(route).send(payload).expect(401);
    });
  });

  describe('/auth/sign-out', () => {
    const route = '/auth/sign-out';
    let test: Test;

    beforeEach(() => {
      test = new Test();
    });

    afterEach(() => test.cleanup());

    it('sets the authentication token cookie as expired', async () => {
      const agent = test.server.as('userId');
      const response = await agent.post(route).expect(204);

      const cookie = test.getCookie(response, 'token');

      expect(cookie).toHaveProperty('Max-Age', '-1');
    });

    it('fails with status 401 when the user is not authenticated', async () => {
      await test.agent.post(route).expect(401);
    });
  });
});

class Test {
  generator = new StubGeneratorAdapter();
  commandBus = new StubCommandBus();
  server = new TestServer(this.generator, this.commandBus);
  agent = this.server.agent;

  async cleanup() {
    await this.server.close();
  }

  parseCookie(cookieStr: string) {
    return cookieStr
      .split(';')
      .map((str) => str.trim())
      .map((str) => str.split('='))
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {} as Record<string, string>);
  }

  getCookie(response: request.Response, name: string) {
    const setCookie = response.get('Set-Cookie');
    const cookies = setCookie.map(this.parseCookie.bind(this));

    const cookie = cookies.find((cookie) => name in cookie);

    assert(cookie, `cookie "${name}" is not set`);

    return cookie;
  }

  getTokenPayload(response: request.Response) {
    return jwt.decode(this.getCookie(response, 'token')['token']);
  }
}
