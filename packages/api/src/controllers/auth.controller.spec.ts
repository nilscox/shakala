import assert from 'assert';

import { expect, stub } from '@shakala/common';
import { SignInBody, SignUpBody } from '@shakala/shared';
import {
  checkUserPassword,
  createUser,
  getUser,
  GetUserResult,
  InvalidCredentialsError,
} from '@shakala/user';
import * as request from 'supertest';
import { afterEach, beforeEach, describe, it } from 'vitest';

import { IntegrationTest } from '../tests/integration-test';
import { jwt } from '../utils/jwt';

describe('[intg] AuthController', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  afterEach(() => test.cleanup());

  describe('/auth/sign-up', () => {
    const route = '/auth/sign-up';

    const payload: SignUpBody = {
      nick: 'user',
      email: 'user@domain.tld',
      password: 'password',
    };

    beforeEach(() => {
      test.generator.nextId = 'userId';
    });

    it('invokes the createUser command', async () => {
      await test.agent.post(route).send(payload).expect(201);

      expect(test.commandBus).toInclude(
        createUser({
          id: 'userId',
          nick: 'user',
          email: 'user@domain.tld',
          password: 'password',
        })
      );
    });

    it("returns the created user's id", async () => {
      const response = await test.agent.post(route).send(payload).expect(201);

      expect(response.text).toEqual('userId');
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

      expect<object>(test.getTokenPayload(response)).toHaveProperty('uid', 'userId');
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

    beforeEach(() => {
      const user: GetUserResult = { id: 'userId', email: 'user@domain.tld' };

      test.user = user;
      test.queryBus.register(getUser({ email: 'user@domain.tld' }), user);
    });

    const payload: SignInBody = {
      email: 'user@domain.tld',
      password: 'password',
    };

    it('succeeds when the checkUserPassword command succeeds', async () => {
      await test.agent.post(route).send(payload).expect(204);

      expect(test.commandBus).toInclude(
        checkUserPassword({
          email: 'user@domain.tld',
          password: 'password',
        })
      );
    });

    it('sets a cookie with the authentication token', async () => {
      const response = await test.agent.post(route).send(payload).expect(204);

      expect<object>(test.getTokenPayload(response)).toHaveProperty('uid', 'userId');
    });

    it('fails with status 401 when the password check fails', async () => {
      test.commandBus.register(checkUserPassword, stub().reject(new InvalidCredentialsError()));

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

    beforeEach(() => {
      test.user = { id: 'userId' };
    });

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

class Test extends IntegrationTest {
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
