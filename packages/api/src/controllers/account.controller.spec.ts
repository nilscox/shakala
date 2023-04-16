import expect from '@nilscox/expect';
import {
  getUser,
  InvalidEmailValidationTokenError,
  listUserActivities,
  updateUserProfile,
  validateUserEmail,
} from '@shakala/user';
import { beforeEach, describe, it } from 'vitest';

import { ControllerTest, createControllerTest } from '../tests/controller-test';

describe('[intg] AccountController', () => {
  const getTest = createControllerTest(Test);
  let test: Test;

  beforeEach(async () => {
    test = await getTest();
  });

  describe('GET /account', () => {
    const route = '/account';

    it("retrieves the authenticated user's profile", async () => {
      test.queryBus.on(getUser({ id: 'userId' })).return('user');

      const response = await expect(test.asUser.get(route)).toHaveStatus(200);

      expect(await response.json()).toEqual('user');
    });
  });

  describe('GET /account/activities', () => {
    const route = '/account/activities';

    it("retrieves the authenticated user's activities", async () => {
      test.queryBus.on(listUserActivities({ userId: 'userId', pageSize: 10, page: 1 })).return({
        total: 1,
        items: ['activity'],
      });

      const response = await expect(test.asUser.get(route)).toHaveStatus(200);

      expect(response.headers.get('pagination-total')).toEqual('1');
      expect(await response.json()).toEqual(['activity']);
    });

    it("retrieves the user's activities with pagination params", async () => {
      test.queryBus
        .on(listUserActivities({ userId: 'userId', pageSize: 5, page: 2 }))
        .return({ total: 0, items: [] });

      const params = new URLSearchParams({
        page: '2',
        pageSize: '5',
      });

      await expect(test.asUser.get(`${route}?${params}`)).toHaveStatus(200);
    });

    it('fails with status 401 when the user is not authenticated', async () => {
      await expect(test.createAgent().get(route)).toHaveStatus(401);
    });
  });

  describe('GET /account/validate-email/:token', () => {
    const route = (token: string) => `/account/validate-email/${token}`;

    it('invokes the validateUserEmail command', async () => {
      await expect(test.asUser.get(route('token'))).toHaveStatus(200);

      expect(test.commandBus).toInclude(
        validateUserEmail({
          userId: 'userId',
          emailValidationToken: 'token',
        })
      );
    });

    it('fails with status 400 when the token is invalid', async () => {
      test.commandBus
        .on(validateUserEmail)
        .throw(new InvalidEmailValidationTokenError('user@email.tld', 'token'));

      const response = await expect(test.asUser.get(route('token'))).toHaveStatus(400);

      expect(await response.json()).toEqual({
        code: 'InvalidEmailValidationTokenError',
        message: expect.any(String),
        details: {
          email: 'user@email.tld',
          token: 'token',
        },
      });
    });

    it('fails with status 401 when the user is not authenticated', async () => {
      await expect(test.createAgent().get(route('token'))).toHaveStatus(401);
    });
  });

  describe('PUT /account/profile', () => {
    const route = '/account/profile';

    it('invokes the validateUserEmail command', async () => {
      await expect(test.asUser.put(route, { nick: 'nick' })).toHaveStatus(204);

      expect(test.commandBus).toInclude(
        updateUserProfile({
          userId: 'userId',
          nick: 'nick',
        })
      );
    });

    it('fails with status 400 when the request body in invalid', async () => {
      await expect(test.asUser.put(route, { nick: '' })).toHaveStatus(400);
    });

    it('fails with status 401 when the user is not authenticated', async () => {
      await expect(test.createAgent().put(route)).toHaveStatus(401);
    });
  });
});

class Test extends ControllerTest {
  asUser = this.as('userId');

  arrange() {
    this.createUser({ id: 'userId' });
  }
}
