import {
  createComment,
  CreateCommentCommand,
  createThread,
  createUser,
  GetCommentQuery,
  GetLastThreadsQuery,
  GetThreadQuery,
  Sort,
} from 'backend-application';

import { StubSessionService, ValidationError, ValidationService } from '../../infrastructure';
import { MockCommandBus, MockQueryBus, MockRequest } from '../../test';

import { ThreadController } from './thread.controller';

describe('ThreadController', () => {
  const queryBus = new MockQueryBus();
  const commandBus = new MockCommandBus();
  const sessionService = new StubSessionService();

  const controller = new ThreadController(queryBus, commandBus, sessionService, new ValidationService());

  describe('getLastThreads', () => {
    const thread = createThread();

    beforeEach(() => {
      queryBus.for(GetLastThreadsQuery).return([thread]);
    });

    it('retrieves the last threads', async () => {
      const response = await controller.getLastThreads(new MockRequest());

      expect(response).toHaveStatus(200);
      expect(response.body).toHaveLength(1);
      expect(response.body).toHaveProperty('0.id', thread.id);

      expect(queryBus.lastQuery).toEqual(new GetLastThreadsQuery(10));
    });

    it('retrieves the 3 last threads', async () => {
      await controller.getLastThreads(new MockRequest().withQuery('count', '3'));

      expect(queryBus.lastQuery).toEqual(new GetLastThreadsQuery(3));
    });

    it('fails when the count is not valid', async () => {
      await expect(controller.getLastThreads(new MockRequest().withQuery('count', '-1'))).rejects.toThrow(
        ValidationError,
      );
    });
  });

  describe('getThread', () => {
    const threadAuthor = createUser();
    const thread = createThread({ author: threadAuthor });

    const commentAuthor = createUser();
    const comment = createComment({ author: commentAuthor });

    const replyAuthor = createUser();
    const reply = createComment({ author: replyAuthor });

    beforeEach(() => {
      queryBus.for(GetThreadQuery).return({
        thread,
        comments: [comment],
        replies: new Map([[comment.id, [reply]]]),
      });
    });

    it('retrieves a thread', async () => {
      const response = await controller.getThread(new MockRequest().withParam('id', thread.id));

      expect(response).toHaveStatus(200);
      expect(response.body).toEqual({
        id: thread.id,
        author: {
          id: threadAuthor.id,
          nick: threadAuthor.nick.value,
          profileImage: undefined,
        },
        text: thread.text.value,
        comments: [
          {
            id: comment.id,
            author: {
              id: commentAuthor.id,
              nick: commentAuthor.nick.value,
              profileImage: undefined,
            },
            text: comment.text.value,
            upvotes: comment.upvotes,
            downvotes: comment.downvotes,
            date: comment.creationDate.value,
            replies: [
              {
                id: reply.id,
                author: {
                  id: replyAuthor.id,
                  nick: replyAuthor.nick.value,
                  profileImage: undefined,
                },
                text: reply.text.value,
                upvotes: 0,
                downvotes: 0,
                date: reply.creationDate.value,
              },
            ],
          },
        ],
        date: thread.created.value,
      });

      expect(queryBus.lastQuery).toEqual(new GetThreadQuery(thread.id, Sort.relevance));
    });

    it('fails to retrieves an thread that does not exist', async () => {
      queryBus.for(GetThreadQuery).return(undefined);

      await expect(controller.getThread(new MockRequest().withParam('id', thread.id))).rejects.test(
        (response) => {
          expect(response).toHaveProperty('body', {
            error: 'NotFound',
            message: 'thread not found',
            details: { threadId: thread.id },
          });
        },
      );
    });
  });

  describe('createComment', () => {
    const user = createUser();
    const thread = createThread();
    const parent = createComment();
    const text = 'hello!';

    const comment = createComment({ author: user });

    beforeEach(() => {
      sessionService.user = user;
      queryBus.for(GetCommentQuery).return(comment);
    });

    it('creates a new root comment', async () => {
      const response = await controller.createComment(
        new MockRequest().withParam('id', thread.id).withBody({ text }),
      );

      expect(response).toHaveStatus(201);
      expect(response).toHaveBody(expect.objectContaining({ id: comment.id }));

      expect(commandBus.execute).toHaveBeenCalledWith(
        new CreateCommentCommand(thread.id, user.id, null, text),
      );
    });

    it('creates a new reply', async () => {
      await controller.createComment(
        new MockRequest().withParam('id', thread.id).withBody({ text, parentId: parent.id }),
      );

      expect(commandBus.execute).toHaveBeenCalledWith(
        new CreateCommentCommand(thread.id, user.id, parent.id, text),
      );
    });

    it('fails to create a comment with an invalid body', async () => {
      await expect(
        controller.createComment(new MockRequest().withParam('id', thread.id).withBody({})),
      ).rejects.test((error) => {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error).toHaveProperty('fields.0.field', 'text');
        expect(error).toHaveProperty('fields.0.error', 'required');
      });
    });
  });
});
