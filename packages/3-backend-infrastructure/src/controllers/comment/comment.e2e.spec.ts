import { CreateCommentBodyDto, ReactionTypeDto, SetReactionBodyDto } from 'shared';
import { SuperAgentTest } from 'supertest';

import { TestConfigService } from '../../infrastructure/services/config.service';
import { MockLoggerService } from '../../infrastructure/services/mock-logger.service';
import { TestServer } from '../../test';

describe('Comment e2e', () => {
  const server = new TestServer();
  let agent: SuperAgentTest;

  server.overrideServices({
    loggerService: new MockLoggerService(),
    configService: new TestConfigService(),
  });

  beforeAll(async () => {
    await server.init();
  });

  let userId: string;

  beforeEach(async () => {
    await server.reset();
    agent = server.agent();

    userId = await server.createUserAndLogin(agent, { email: 'user@domain.tld', password: 'p4ssw0rd' });
  });

  test('as a user, I can create and edit a comment', async () => {
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
    const createdId: string = createResponse.body;

    await editComment(createdId);

    // const thread = await getThread(threadId);

    // expect(thread.comments).toHaveProperty('[0].edited', expect.any(String));
  });

  test('as a user, I can set a reaction on a comment', async () => {
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
});
