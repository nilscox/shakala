import { LoginDto, ReactionTypeDto } from 'shared';
import { Request, SuperAgentTest } from 'supertest';

import { TestServer } from '../../test';

import { SetReactionDto } from './thread.controller';

export const logResponse = (req: Request) => {
  req.on('response', (res) => console.dir(res.body, { depth: null }));
};

describe('Thread e2e', () => {
  const server = new TestServer();
  let agent: SuperAgentTest;

  beforeAll(async () => {
    await server.init();
  });

  beforeEach(async () => {
    await server.reset();
    agent = server.agent();
  });

  test('create a thread', async () => {
    const loginDto: LoginDto = { email: 'user@domain.tld', password: 'p4ssw0rd' };
    const createThreadDto = { description: 'description', text: 'text', keywords: ['key', 'words'] };

    const login = async () => {
      await agent.post('/auth/login').send(loginDto).expect(200);
    };

    const createThread = async (): Promise<string> => {
      const { body } = await agent.post('/thread').send(createThreadDto).expect(201);
      return body;
    };

    const getThread = async (threadId: string) => {
      await agent.get(`/thread/${threadId}`).expect(200);
    };

    await server.createUser(loginDto.email, loginDto.password);

    await login();

    const threadId = await createThread();
    await getThread(threadId);
  });

  test('create a comment', async () => {
    const loginDto: LoginDto = { email: 'user@domain.tld', password: 'p4ssw0rd' };

    const login = async () => {
      await agent.post('/auth/login').send(loginDto).expect(200);
    };

    const createComment = async (threadId: string) => {
      const body = { text: 'hello' };

      return agent.post(`/thread/${threadId}/comment`).send(body).expect(201);
    };

    const updateComment = async (threadId: string, commentId: string) => {
      const body = { text: 'updated' };

      await agent.put(`/thread/${threadId}/comment/${commentId}`).send(body).expect(204);
    };

    const userId = await server.createUser(loginDto.email, loginDto.password);
    const threadId = await server.createThread(userId);

    await login();

    const createResponse = await createComment(threadId);
    const createdId: string = createResponse.body;

    await updateComment(threadId, createdId);
  });

  test('set a reaction', async () => {
    const loginDto: LoginDto = { email: 'user@domain.tld', password: 'p4ssw0rd' };

    const login = async () => {
      await agent.post('/auth/login').send(loginDto).expect(200);
    };

    const setReaction = async (threadId: string, commentId: string, type: ReactionTypeDto | null) => {
      const body: SetReactionDto = { type };

      await agent.put(`/thread/${threadId}/comment/${commentId}/reaction`).send(body).expect(204);
    };

    const userId = await server.createUser(loginDto.email, loginDto.password);
    const threadId = await server.createThread(userId);
    const commentId = await server.createComment(threadId, userId);

    await login();

    await setReaction(threadId, commentId, ReactionTypeDto.upvote);
    await setReaction(threadId, commentId, ReactionTypeDto.downvote);
    await setReaction(threadId, commentId, null);
  });
});
