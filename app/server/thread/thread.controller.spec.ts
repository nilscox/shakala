import { FormData } from '@remix-run/node';
import { MockedObject } from 'vitest';

import { ValidationService } from '~/server/common/validation.service';
import { createRequest } from '~/server/test/create-request';
import { createCommentEntity, createThreadEntity, createUser } from '~/server/test/factories';

import { UserService } from '../user/user.service';

import { CommentAuthor } from './comment.entity';
import { CommentService } from './comment.service';
import { ThreadController } from './thread.controller.server';
import { ThreadAuthor } from './thread.entity';
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
    const threadAuthor = createUser({
      id: threadAuthorId,
      nick: 'thread author',
      profileImage: 'image',
    });

    const threadId = 'threadId';
    const thread = createThreadEntity({
      id: threadId,
      author: ThreadAuthor.create(threadAuthor),
      text: 'Thread',
      created: '2022-01-01',
    });

    const commentAuthorId = 'commentAuthorId';
    const commentAuthor = createUser({ id: commentAuthorId, nick: 'comment author' });

    const commentId = 'commentId';
    const comment = createCommentEntity({
      id: commentId,
      author: CommentAuthor.create(commentAuthor),
      text: 'Comment',
      upvotes: 1,
      downvotes: 2,
      lastEditionDate: '2022-01-01',
    });

    const replyAuthorId = 'replyAuthorId';
    const replyAuthor = createUser({ id: replyAuthorId, nick: 'reply author' });

    const replyId = 'replyId';
    const reply = createCommentEntity({
      id: replyId,
      author: CommentAuthor.create(replyAuthor),
      text: 'Reply',
      upvotes: 0,
      downvotes: 0,
      lastEditionDate: '2022-01-01',
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
        date: thread.created.value,
        author: {
          id: threadAuthorId,
          nick: threadAuthor.nick.value,
          profileImage: threadAuthor.profileImage.value,
        },
        text: thread.text.value,
        comments: [
          {
            id: comment.id,
            author: {
              id: commentAuthorId,
              nick: commentAuthor.nick.value,
            },
            text: comment.text.value,
            date: comment.lastEditionDate.value,
            upvotes: 1,
            downvotes: 2,
            replies: [
              {
                id: reply.id,
                author: {
                  id: replyAuthorId,
                  nick: replyAuthor.nick.value,
                },
                text: reply.text.value,
                date: reply.lastEditionDate.value,
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
    const user = createUser();

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
    const user = createUser();

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
