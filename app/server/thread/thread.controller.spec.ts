import { FormData } from '@remix-run/node';
import { MockedObject } from 'vitest';

import { ValidationService } from '~/server/common/validation.service';
import { createRequest } from '~/server/test/create-request';
import { createCommentEntity, createThreadEntity, createUserEntity } from '~/server/test/factories';

import { UserService } from '../user/user.service';

import { CommentService } from './comment.service';
import { ThreadController } from './thread.controller.server';
import { ThreadService } from './thread.service';

describe('ThreadController', () => {
  const userService = {
    findById: vi.fn(),
    requireUser: vi.fn(),
  } as MockedObject<UserService>;

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
    new ValidationService(),
    userService,
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
      await userService.findById.mockResolvedValueOnce(threadAuthor);
      await userService.findById.mockResolvedValueOnce(commentAuthor);
      await userService.findById.mockResolvedValueOnce(replyAuthor);

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
        text: thread.text,
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

  describe('createComment', () => {
    const form = new FormData();
    const user = createUserEntity();

    beforeEach(() => {
      form.set('threadId', 'threadId');
      form.set('message', 'Hello!');

      userService.requireUser.mockResolvedValueOnce(user);
      commentService.createComment.mockResolvedValueOnce(createCommentEntity());
    });

    it('creates a new root comment on a thread', async () => {
      const response = await controller.createComment(createRequest({ form }));

      expect(response).toHaveStatus(201);
      expect(await response.json()).toEqual({ ok: true });

      expect(commentService.createComment).toHaveBeenCalledWith(user, 'threadId', null, 'Hello!');
    });
  });

  describe('updateComment', () => {
    const form = new FormData();
    const user = createUserEntity();

    beforeEach(() => {
      form.set('commentId', 'commentId');
      form.set('message', 'Hello!');

      userService.requireUser.mockResolvedValueOnce(user);
      commentService.createComment.mockResolvedValueOnce(createCommentEntity());
    });

    it('updates an existing comment', async () => {
      const response = await controller.updateComment(createRequest({ form }));

      expect(response).toHaveStatus(200);
      expect(await response.json()).toEqual({ ok: true });

      expect(commentService.updateComment).toHaveBeenCalledWith(user, 'commentId', 'Hello!');
    });
  });
});
