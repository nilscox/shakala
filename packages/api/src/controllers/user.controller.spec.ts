import { expect, stub } from '@shakala/common';
import {
  create,
  InMemoryUserRepository,
  InvalidEmailValidationTokenError,
  USER_TOKENS,
  ValidateUserEmailHandler,
} from '@shakala/user';
import { afterEach, beforeEach, describe, it } from 'vitest';

import { container } from '../container';
import { IntegrationTest } from '../tests/integration-test';

describe('[intg] UserController', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  afterEach(() => test.cleanup());

  describe('/user', () => {
    const route = '/user';

    it("retrieves the currently authenticated user's profile", async () => {
      test.userRepository.add(create.user({ id: 'userId', email: 'user@domain.tld' }));

      const response = await test.asUser.get(route).expect(200);

      expect(response.body).toEqual({
        id: 'userId',
        email: 'user@domain.tld',
      });
    });
  });

  describe('/user/validate-email/:token', () => {
    const route = (token: string) => `/user/validate-email/${token}`;

    it('invokes the ValidateUserEmail command', async () => {
      await test.asUser.get(route('token')).expect(200);

      expect(test.stubValidateUserEmail).calledWith({
        userId: 'userId',
        emailValidationToken: 'token',
      });
    });

    it('fails with status 400 when the token is invalid', async () => {
      test.stubValidateUserEmail.reject(new InvalidEmailValidationTokenError('user@email.tld', 'token'));

      const response = await test.asUser.get(route('token')).expect(400);

      expect<object>(response.body).toEqual({
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
  public readonly user = create.user({ id: 'userId' });

  public readonly userRepository = new InMemoryUserRepository([this.user]);
  public readonly stubValidateUserEmail = stub<ValidateUserEmailHandler['handle']>();

  constructor() {
    super();

    container.bind(USER_TOKENS.userRepository).toConstant(this.userRepository);
    this.bindHandler(USER_TOKENS.validateUserEmailHandler, this.stubValidateUserEmail);
  }

  get asUser() {
    return this.as(this.user.id);
  }
}
