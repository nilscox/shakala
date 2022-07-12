import { createComment, createThread } from 'backend-application';
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

  beforeEach(() => {
    agent = server.agent();
  });

  test('create a comment', async () => {
    const user: LoginDto = { email: 'user@domain.tld', password: 'p4ssw0rd' };
    const threadId = 'threadId';

    const login = async () => {
      await agent.post('/auth/login').send(user).expect(200);
    };

    const createComment = async () => {
      const body = { text: 'hello' };

      return agent.post(`/thread/${threadId}/comment`).send(body).expect(201);
    };

    const updateComment = async (commentId: string) => {
      const body = { text: 'updated' };

      await agent.put(`/thread/${threadId}/comment/${commentId}`).send(body).expect(204);
    };

    await server.saveUser(user.email, user.password);
    await server.saveThread(createThread({ id: threadId }));

    await login();

    const createResponse = await createComment();
    const createdId: string = createResponse.body;

    await updateComment(createdId);
  });

  test('set a reaction', async () => {
    const user: LoginDto = { email: 'user@domain.tld', password: 'p4ssw0rd' };
    const threadId = 'threadId';
    const commentId = 'commentId';

    const login = async () => {
      await agent.post('/auth/login').send(user).expect(200);
    };

    const setReaction = async (type: ReactionTypeDto | null) => {
      const body: SetReactionDto = { type };

      await agent.put(`/thread/${threadId}/comment/${commentId}/reaction`).send(body).expect(204);
    };

    await server.saveUser(user.email, user.password);
    await server.saveThread(createThread({ id: threadId }));
    await server.saveComment(createComment({ id: commentId }));

    await login();

    await setReaction(ReactionTypeDto.upvote);
    await setReaction(ReactionTypeDto.downvote);
    await setReaction(null);
  });
});
