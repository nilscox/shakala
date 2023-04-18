import assert from 'assert';

import expect from '@nilscox/expect';
import { SignInBody, SignUpBody, waitFor } from '@shakala/shared';
import { GetUserResult } from '@shakala/user';
import { beforeEach, describe, it } from 'vitest';

import { createE2eTest, E2ETest } from '../tests/e2e-test';

describe('[e2e] user', () => {
  const getTest = createE2eTest(Test);
  let test: Test;

  beforeEach(async () => {
    test = await getTest();
  });

  it('As a future user, I can sign up, sign out and sign back in', async () => {
    const agent = test.server.agent();

    await expect(
      agent.post('/auth/sign-up', {
        email: 'user@domain.tld',
        nick: 'user',
        password: 'password',
      } satisfies SignUpBody)
    ).toHaveStatus(201);

    await expect(agent.get('/account')).toHaveStatus(200);

    await expect(agent.post('/auth/sign-out')).toHaveStatus(204);

    await expect(agent.get('/account')).toHaveStatus(401);

    await expect(
      agent.post('/auth/sign-in', { email: 'user@domain.tld', password: 'password' } satisfies SignInBody)
    ).toHaveStatus(204);

    await expect(agent.get('/account')).toHaveStatus(200);
  });

  it('As a new user, I can validate my email address', async () => {
    const agent = test.server.agent();

    await expect(
      agent.post('/auth/sign-up', {
        email: 'user@domain.tld',
        nick: 'user',
        password: 'password',
      } satisfies SignUpBody)
    ).toHaveStatus(201);

    const token = await test.getEmailValidationToken();
    await expect(agent.get(`/account/validate-email/${token}`)).toHaveStatus(200);

    const user = await getUser();
    expect(user).toHaveProperty('emailValidated', true);

    async function getUser(): Promise<GetUserResult> {
      const response = await expect(agent.get('/account')).toHaveStatus(200);
      return response.json();
    }
  });
});

class Test extends E2ETest {
  getWelcomeEmailText = async () => {
    const emails = await expect(this.emails.all('user@domain.tld')).toResolve();

    expect(emails).toHaveLength(1);
    return emails[0].text;
  };

  getEmailValidationToken = async () => {
    const text = await waitFor(this.getWelcomeEmailText);
    const [link] = text.split('\n').filter((line) => line.match(/^http.*$/));

    assert(link, 'cannot find email validation link');

    return new URL(link).searchParams.get('email-validation-token');
  };
}
