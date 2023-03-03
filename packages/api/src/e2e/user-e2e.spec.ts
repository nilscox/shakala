import { SignInBody, SignUpBody } from '@shakala/shared';
import { afterEach, beforeEach, describe, it } from 'vitest';

import { E2ETest } from '../tests/e2e-test';
import { expect } from '../tests/expect';

describe('[e2e] user', () => {
  let test: Test;

  beforeEach(() => void (test = new Test()));
  beforeEach(() => test.setup());
  afterEach(() => test.cleanup());

  it('As a future user, I can sign up, sign out and sign back in', async () => {
    const agent = test.server.agent();

    await expect(
      agent.post('/auth/sign-up', {
        email: 'user@domain.tld',
        nick: 'user',
        password: 'password',
      } satisfies SignUpBody)
    ).toHaveStatus(201);

    await expect(agent.get('/user')).toHaveStatus(200);

    await expect(agent.post('/auth/sign-out')).toHaveStatus(204);

    await expect(agent.get('/user')).toHaveStatus(401);

    await expect(
      agent.post('/auth/sign-in', { email: 'user@domain.tld', password: 'password' } satisfies SignInBody)
    ).toHaveStatus(204);

    await expect(agent.get('/user')).toHaveStatus(200);
  });
});

class Test extends E2ETest {}
