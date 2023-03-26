import assert from 'assert';

import expect from '@nilscox/expect';
import { SignInBody, SignUpBody } from '@shakala/shared';
import {
  checkUserPassword,
  createUser,
  getUser,
  GetUserResult,
  InvalidCredentialsError,
} from '@shakala/user';
import { beforeEach, describe, it } from 'vitest';

import { createControllerTest, ControllerTest } from '../tests/controller-test';
import { jwt } from '../utils/jwt';

describe('[intg] AuthController', () => {
  const getTest = createControllerTest(Test);
  let test: Test;

  beforeEach(async () => {
    test = await getTest();
  });

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
      await expect(test.agent.post(route, payload)).toHaveStatus(201);

      expect(test.commandBus).toInclude(
        createUser({
          userId: 'userId',
          nick: 'user',
          email: 'user@domain.tld',
          password: 'password',
        })
      );
    });

    it("returns the created user's id", async () => {
      const response = await expect(test.agent.post(route, payload)).toHaveStatus(201);

      expect(await response.text()).toEqual('userId');
    });

    it('sets a cookie with the authentication token', async () => {
      await expect(test.agent.post(route, payload)).toHaveStatus(201);

      const cookie = test.agent.getCookie('token');

      assert(cookie);
      expect(cookie.maxAge).toEqual(expect.any(Number));
      expect(cookie.path).toEqual('/');
      expect(cookie.sameSite).toEqual('strict');
      // expect(cookie.secure).toEqual(true);
      expect(cookie.httpOnly).toEqual(true);

      expect<object>(test.tokenPayload).toHaveProperty('uid', 'userId');
    });

    it('fails with status 400 when the payload is invalid', async () => {
      await expect(test.agent.post(route, {})).toHaveStatus(400);
    });

    it('fails with status 401 when the user is already authenticated', async () => {
      test.createUser({ id: 'userId' });
      await expect(test.as('userId').post(route, payload)).toHaveStatus(401);
    });
  });

  describe('/auth/sign-in', () => {
    const route = '/auth/sign-in';

    beforeEach(() => {
      const user: GetUserResult = {
        id: 'userId',
        email: 'user@domain.tld',
        profileImage: '',
        emailValidated: true,
        nick: '',
        signupDate: '',
      };

      test.queryBus.on(getUser({ id: 'userId' })).return(user);
      test.queryBus.on(getUser({ email: 'user@domain.tld' })).return(user);
    });

    const payload: SignInBody = {
      email: 'user@domain.tld',
      password: 'password',
    };

    it('succeeds when the checkUserPassword command succeeds', async () => {
      await expect(test.agent.post(route, payload)).toHaveStatus(204);

      expect(test.commandBus).toInclude(
        checkUserPassword({
          email: 'user@domain.tld',
          password: 'password',
        })
      );
    });

    it('sets a cookie with the authentication token', async () => {
      await expect(test.agent.post(route, payload)).toHaveStatus(204);

      expect<object>(test.tokenPayload).toHaveProperty('uid', 'userId');
    });

    it('fails with status 401 when the password check fails', async () => {
      test.commandBus.on(checkUserPassword).throw(new InvalidCredentialsError());

      await expect(test.agent.post(route, payload)).toHaveStatus(401);
    });

    it('fails with status 400 when the payload is invalid', async () => {
      await expect(test.agent.post(route, {})).toHaveStatus(400);
    });

    it('fails with status 401 when the user is already authenticated', async () => {
      const agent = test.as('userId');
      await expect(agent.post(route, payload)).toHaveStatus(401);
    });
  });

  describe('/auth/sign-out', () => {
    const route = '/auth/sign-out';

    beforeEach(() => {
      test.createUser({ id: 'userId' });
    });

    it('sets the authentication token cookie as expired', async () => {
      const agent = test.as('userId');

      await expect(agent.post(route)).toHaveStatus(204);

      expect(agent.getCookie('token')).toBeUndefined();
    });

    it('fails with status 401 when the user is not authenticated', async () => {
      await expect(test.agent.post(route)).toHaveStatus(401);
    });
  });
});

class Test extends ControllerTest {
  agent = this.createAgent();

  get tokenCookie() {
    return this.agent.getCookie('token');
  }

  get tokenPayload() {
    assert(this.tokenCookie);
    return jwt.decode(this.tokenCookie.value);
  }
}
