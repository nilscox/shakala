import { InMemoryEmailSenderAdapter } from '@shakala/backend-application';
import { SuperAgentTest } from 'supertest';

import { StubConfigAdapter } from '../../infrastructure';
import { MockLoggerAdapter } from '../../infrastructure/test';
import { TestServer } from '../../test';

describe('Thread e2e', () => {
  const server = new TestServer();
  let agent: SuperAgentTest;

  server.override({
    logger: new MockLoggerAdapter(),
    config: new StubConfigAdapter().withEnvDatabase(),
    emailSender: new InMemoryEmailSenderAdapter(),
  });

  before(async () => {
    await server.init();
  });

  beforeEach(async () => {
    await server.reset();
    agent = server.agent();

    await server.createUserAndLogin(agent, { email: 'user@domain.tld', password: 'p4ssw0rd' });
  });

  it('create a thread', async () => {
    const createThreadDto = { description: 'description', text: 'text', keywords: ['key', 'words'] };

    const createThread = async (): Promise<string> => {
      const { body } = await agent.post('/thread').send(createThreadDto).expect(201);
      return body.id;
    };

    const getThread = async (threadId: string) => {
      await agent.get(`/thread/${threadId}`).expect(200);
    };

    const threadId = await createThread();
    await getThread(threadId);
  });
});
