import { InMemoryEmailSenderAdapter } from 'backend-application';
import { CreateCommentBodyDto, ReactionTypeDto, ReportCommentBodyDto, SetReactionBodyDto } from 'shared';
import { SuperAgentTest } from 'supertest';

import { MockLoggerAdapter, StubConfigAdapter } from '../../infrastructure';
import { TestServer } from '../../test';

describe('Comment e2e', function () {
  this.slow(1000);

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

  let userId: string;

  beforeEach(async () => {
    await server.reset();
    agent = server.agent();

    userId = await server.createUserAndLogin(agent, { email: 'user@domain.tld', password: 'p4ssw0rd' });
  });

  it('as a user, I can create and edit a comment', async () => {
    const getThread = async (threadId: string) => {
      return agent.get(`/thread/${threadId}`).expect(200);
    };

    const createComment = async (threadId: string) => {
      const body: CreateCommentBodyDto = { threadId, text: 'hello' };

      return agent.post('/comment').send(body).expect(201);
    };

    const editComment = async (commentId: string) => {
      const body = { text: 'new text' };

      await agent.put(`/comment/${commentId}`).send(body).expect(204);
    };

    const threadId = await server.createThread(userId);

    const createResponse = await createComment(threadId);
    const createdId = createResponse.body.id;

    await editComment(createdId);

    const { body: thread } = await getThread(threadId);

    expect(thread.comments).toHaveProperty('0.edited', expect.any(String));
    expect(thread.comments).toHaveProperty('0.history.0.text', 'hello');
  });

  it('as a user, I can set a reaction on a comment', async () => {
    const agent = server.agent();

    await server.createUserAndLogin(agent, { email: 'user2@domain.tld', password: 'p4ssw0rd' });

    const setReaction = async (commentId: string, type: ReactionTypeDto | null) => {
      const body: SetReactionBodyDto = { type };

      await agent.put(`/comment/${commentId}/reaction`).send(body).expect(204);
    };

    const threadId = await server.createThread(userId);
    const commentId = await server.createComment(threadId, userId);

    await setReaction(commentId, ReactionTypeDto.upvote);
    await setReaction(commentId, ReactionTypeDto.downvote);
    await setReaction(commentId, null);
  });

  it('as a user, I can report a comment', async () => {
    const agent = server.agent();

    await server.createUserAndLogin(agent, { email: 'user2@domain.tld', password: 'p4ssw0rd' });

    const reportComment = async (commentId: string) => {
      const body: ReportCommentBodyDto = { reason: 'reason' };

      await agent.post(`/comment/${commentId}/report`).send(body).expect(204);
    };

    const threadId = await server.createThread(userId);
    const commentId = await server.createComment(threadId, userId);

    await reportComment(commentId);
  });
});
