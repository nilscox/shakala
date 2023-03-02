import { StubLoggerAdapter, TOKENS } from '@shakala/common';
import { SignInBody, SignUpBody } from '@shakala/shared';
import { describe, test } from 'vitest';

import { container } from '../container';
import { expect } from '../tests/expect';
import { TestServer } from '../tests/test-server';
import { API_TOKENS } from '../tokens';

describe('[e2e] user', () => {
  test('As a future user, I can sign up, sign out and sign back in', async () => {
    container.bind(TOKENS.logger).toInstance(StubLoggerAdapter).inContainerScope();
    container.bind(API_TOKENS.testServer).toInstance(TestServer).inContainerScope();

    const server = container.get(API_TOKENS.testServer);
    const agent = server.agent();

    await server.init();

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
