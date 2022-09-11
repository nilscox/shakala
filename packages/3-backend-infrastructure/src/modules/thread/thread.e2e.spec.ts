import { SuperAgentTest } from 'supertest';

import { MockLoggerService, TestConfigService } from '../../infrastructure';
import { TestServer } from '../../test';

describe('Thread e2e', () => {
  const server = new TestServer();
  let agent: SuperAgentTest;

  server.overrideServices({
    loggerService: new MockLoggerService(),
    configService: new TestConfigService(),
  });

  beforeAll(async () => {
    await server.init();
  });

  beforeEach(async () => {
    await server.reset();
    agent = server.agent();

    await server.createUserAndLogin(agent, { email: 'user@domain.tld', password: 'p4ssw0rd' });
  });

  test('create a thread', async () => {
    const createThreadDto = { description: 'description', text: 'text', keywords: ['key', 'words'] };

    const createThread = async (): Promise<string> => {
      const { body } = await agent.post('/thread').send(createThreadDto).expect(201);
      return body;
    };

    const getThread = async (threadId: string) => {
      await agent.get(`/thread/${threadId}`).expect(200);
    };

    const threadId = await createThread();
    await getThread(threadId);
  });
});
