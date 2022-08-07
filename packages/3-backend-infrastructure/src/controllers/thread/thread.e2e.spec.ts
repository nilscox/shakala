import { ReactionTypeDto, SetReactionBodyDto, ThreadWithCommentsDto } from 'shared';
import { Request, SuperAgentTest } from 'supertest';

import { TestServer } from '../../test';

export const logResponse = (req: Request) => {
  req.on('response', (res) => console.dir(res.body, { depth: null }));
};

describe('Thread e2e', () => {
  const server = new TestServer();
  let agent: SuperAgentTest;

  beforeAll(async () => {
    await server.init();
  });

  let userId: string;

  beforeEach(async () => {
    await server.reset();
    agent = server.agent();

    userId = await server.createUserAndLogin(agent, { email: 'user@domain.tld', password: 'p4ssw0rd' });
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

  test('create and edit a comment', async () => {
    const createComment = async (threadId: string) => {
      const body = { text: 'hello' };

      return agent.post(`/thread/${threadId}/comment`).send(body).expect(201);
    };

    const editComment = async (threadId: string, commentId: string) => {
      const body = { text: 'new text' };

      await agent.put(`/thread/${threadId}/comment/${commentId}`).send(body).expect(204);
    };

    const getThread = async (threadId: string): Promise<ThreadWithCommentsDto> => {
      const { body } = await agent.get(`/thread/${threadId}`).expect(200);

      return body;
    };

    const threadId = await server.createThread(userId);

    const createResponse = await createComment(threadId);
    const createdId: string = createResponse.body;

    await editComment(threadId, createdId);

    const thread = await getThread(threadId);

    expect(thread.comments).toHaveProperty('[0].edited', expect.any(String));
  });

  test('set a reaction', async () => {
    const setReaction = async (threadId: string, commentId: string, type: ReactionTypeDto | null) => {
      const body: SetReactionBodyDto = { type };

      await agent.put(`/thread/${threadId}/comment/${commentId}/reaction`).send(body).expect(204);
    };

    const threadId = await server.createThread(userId);
    const commentId = await server.createComment(threadId, userId);

    await setReaction(threadId, commentId, ReactionTypeDto.upvote);
    await setReaction(threadId, commentId, ReactionTypeDto.downvote);
    await setReaction(threadId, commentId, null);
  });
});
