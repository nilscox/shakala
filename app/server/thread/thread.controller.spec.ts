import { FormData } from '@remix-run/node';
import { MockedObject } from 'vitest';

import { StubSessionService } from '~/server/common/session.service';
import { ValidationService } from '~/server/common/validation.service';
import { InMemoryUserRepository } from '~/server/data/user/in-memory-user.repository';
import { createRequest } from '~/server/test/create-request';
import { createCommentEntity, createThreadEntity, createUserEntity } from '~/server/test/factories';

import { CommentService } from './comment.service';
import { ThreadController } from './thread.controller.server';
import { ThreadService } from './thread.service';

describe('ThreadController', () => {
  const sessionService = new StubSessionService();

  const userRepository = new InMemoryUserRepository();

  const threadService = {
    findLastThreads: vi.fn(),
    findThreadById: vi.fn(),
  } as MockedObject<ThreadService>;

  const commentService = {
    findForThread: vi.fn(),
    findReplies: vi.fn(),
    createComment: vi.fn(),
    updateComment: vi.fn(),
  } as MockedObject<CommentService>;

  const controller = new ThreadController(
    sessionService,
    new ValidationService(),
    userRepository,
    threadService,
    commentService,
  );

  describe('getThread', () => {
    const threadAuthorId = 'threadAuthorId';
    const threadAuthor = createUserEntity({
      id: threadAuthorId,
      nick: 'thread author',
      profileImage: 'image',
    });

    const threadId = 'threadId';
    const thread = createThreadEntity({
      id: threadId,
      authorId: threadAuthorId,
      text: 'Thread',
      createdAt: new Date('2022-01-01').toISOString(),
    });

    const commentAuthorId = 'commentAuthorId';
    const commentAuthor = createUserEntity({ id: commentAuthorId, nick: 'comment author' });

    const commentId = 'commentId';
    const comment = createCommentEntity({
      id: commentId,
      authorId: commentAuthorId,
      text: 'Comment',
      upvotes: 1,
      downvotes: 2,
      createdAt: new Date('2022-01-01').toISOString(),
    });

    const replyAuthorId = 'replyAuthorId';
    const replyAuthor = createUserEntity({ id: replyAuthorId, nick: 'reply author' });

    const replyId = 'replyId';
    const reply = createCommentEntity({
      id: replyId,
      authorId: replyAuthorId,
      text: 'Reply',
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date('2022-01-01').toISOString(),
    });

    it('retrieves an existing thread', async () => {
      await userRepository.save(threadAuthor);
      await userRepository.save(commentAuthor);
      await userRepository.save(replyAuthor);

      threadService.findThreadById.mockResolvedValueOnce(thread);
      commentService.findForThread.mockResolvedValueOnce([comment]);
      commentService.findReplies.mockResolvedValue([]);
      commentService.findReplies.mockResolvedValueOnce([reply]);

      const response = await controller.getThread(createRequest(), threadId);

      expect(response).toHaveStatus(200);
      expect(await response.json()).toEqual({
        id: threadId,
        date: thread.createdAt,
        author: {
          id: threadAuthorId,
          nick: threadAuthor.nick,
          profileImage: threadAuthor.profileImage,
        },
        text: 'Hello!',
        comments: [
          {
            id: comment.id,
            author: {
              id: commentAuthorId,
              nick: commentAuthor.nick,
            },
            text: comment.text,
            date: comment.createdAt,
            upvotes: 1,
            downvotes: 2,
            replies: [
              {
                id: reply.id,
                author: {
                  id: replyAuthorId,
                  nick: replyAuthor.nick,
                },
                text: reply.text,
                date: reply.createdAt,
                upvotes: 0,
                downvotes: 0,
                replies: [],
              },
            ],
          },
        ],
      });
    });
  });

  it('creates a new root comment on a thread', async () => {
    const form = new FormData();

    form.set('threadId', 'threadId');
    form.set('message', 'Hello!');

    const request = createRequest({ form });

    userRepository.save(createUserEntity({ id: 'userId' }));
    sessionService.save(sessionService.createSession('userId'));

    commentService.createComment.mockResolvedValueOnce(createCommentEntity());

    const response = await controller.createComment(request);

    expect(response).toHaveStatus(201);
    expect(response.body).toBeNull();
  });

  it('updates an existing comment', async () => {
    const form = new FormData();

    form.set('commentId', 'commentId');
    form.set('message', 'Hello!');

    const request = createRequest({ form });

    userRepository.save(createUserEntity({ id: 'userId' }));
    sessionService.save(sessionService.createSession('userId'));

    commentService.createComment.mockResolvedValueOnce(createCommentEntity());

    const response = await controller.updateComment(request);

    expect(response).toHaveStatus(204);
    expect(response.body).toBeNull();
  });
});
