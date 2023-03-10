import { GetUserResult, InvalidEmailValidationTokenError, validateUserEmail } from '@shakala/user';
import { afterEach, beforeEach, describe, it } from 'vitest';

import { expect } from '../tests/expect';
import { FetchAgent } from '../tests/fetch-agent';
import { IntegrationTest } from '../tests/integration-test';

describe('[intg] UserController', () => {
  let test: Test;

  beforeEach(() => void (test = new Test()));
  beforeEach(() => test?.setup());
  afterEach(() => test?.cleanup());

  describe('/user', () => {
    const route = '/user';

    it("retrieves the authenticated user's profile", async () => {
      test.user = { id: 'userId', email: 'user@domain.tld' };

      const response = await expect(test.asUser.get(route)).toHaveStatus(200);

      expect<GetUserResult>(await response.json()).toEqual({
        id: 'userId',
        email: 'user@domain.tld',
        nick: '',
      });
    });
  });

  describe('/user/validate-email/:token', () => {
    const route = (token: string) => `/user/validate-email/${token}`;

    beforeEach(() => {
      test.user = { id: 'userId' };
    });

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
});

class Test extends IntegrationTest {
  asUser!: FetchAgent;

  arrange() {
    this.user = { id: 'userId' };
    this.asUser = this.as('userId');
  }
}
