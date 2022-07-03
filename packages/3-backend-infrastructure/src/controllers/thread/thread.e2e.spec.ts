import { createThread } from 'backend-application';
import { CommentDto, LoginDto } from 'shared';
import { Request } from 'supertest';

import { TestServer } from '../../test';

export const logResponse = (req: Request) => {
  req.on('response', (res) => console.log(res.body));
};

describe('Thread e2e', () => {
  const server = new TestServer();
  const agent = server.agent();

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

      await agent.put(`/thread/${threadId}/comment/${commentId}`).send(body).expect(200);
    };

    await server.saveUser(user.email, user.password);
    await server.saveThread(createThread({ id: threadId }));

    await login();

    const createResponse = await createComment();
    const created: CommentDto = createResponse.body;

    await updateComment(created.id);
  });
});
