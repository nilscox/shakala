import { expect, stub } from '@shakala/common';
import { InvalidEmailValidationTokenError, validateUserEmail } from '@shakala/user';
import { afterEach, beforeEach, describe, it } from 'vitest';

import { IntegrationTest } from '../tests/integration-test';

describe('[intg] UserController', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  afterEach(() => test.cleanup());

  describe('/user', () => {
    const route = '/user';

    it("retrieves the authenticated user's profile", async () => {
      test.user = { id: 'userId', email: 'user@domain.tld' };

      const response = await test.asUser.get(route).expect(200);

      expect(response.body).toEqual({
        id: 'userId',
        email: 'user@domain.tld',
      });
    });
  });

  describe('/user/validate-email/:token', () => {
    const route = (token: string) => `/user/validate-email/${token}`;

    beforeEach(() => {
      test.user = { id: 'userId' };
    });

    it('invokes the validateUserEmail command', async () => {
      await test.asUser.get(route('token')).expect(200);

      expect(test.commandBus).toInclude(
        validateUserEmail({
          userId: 'userId',
          emailValidationToken: 'token',
        })
      );
    });

    it('fails with status 400 when the token is invalid', async () => {
      test.commandBus.register(
        validateUserEmail,
        stub().reject(new InvalidEmailValidationTokenError('user@email.tld', 'token'))
      );

      const response = await test.asUser.get(route('token')).expect(400);

      expect<unknown>(response.body).toEqual({
        code: 'InvalidEmailValidationTokenError',
        message: expect.any(String),
        details: {
          email: 'user@email.tld',
          token: 'token',
        },
      });
    });

    it('fails with status 401 when the user is not authenticated', async () => {
      await test.agent.get(route('token')).expect(401);
    });
  });
});

class Test extends IntegrationTest {
  get asUser() {
    return this.as('userId');
  }
}
