import expect from '@nilscox/expect';
import {
  CreateCommentBody,
  EditCommentBody,
  ReactionType,
  ReportCommentBody,
  SetReactionBody,
} from '@shakala/shared';
import {
  createComment,
  editComment,
  getComment,
  GetCommentResult,
  reportComment,
  setCommentSubscription,
  setReaction,
} from '@shakala/thread';
import { beforeEach, describe, it } from 'vitest';

import { createControllerTest, ControllerTest } from '../tests/controller-test';

describe('[intg] CommentController', () => {
  const getTest = createControllerTest(Test);
  let test: Test;

  beforeEach(async () => {
    test = await getTest();
  });

  describe('GET /:commentId', () => {
    const route = '/comment/commentId';

    const result: GetCommentResult = {
      id: 'commentId',
      threadId: 'threadId',
      author: { id: 'authorId', nick: 'author', profileImage: 'profileImage' },
      text: 'text',
      date: 'date',
      edited: false,
      history: [],
      upvotes: 0,
      downvotes: 0,
      replies: [],
    };

    it('retrieves a comment from its id', async () => {
      test.queryBus.on(getComment({ commentId: 'commentId' })).return(result);

      const response = await expect(test.createAgent().get(route)).toHaveStatus(200);

      expect(await response.json()).toEqual(result);
    });

    it('retrieves a comment as an authenticated user', async () => {
      test.queryBus.on(getComment({ commentId: 'commentId', userId: 'userId' })).return(result);

      const response = await expect(test.as('userId').get(route)).toHaveStatus(200);

      expect(await response.json()).toEqual(result);
    });

    it('fails with status 404 when the comment does not exist', async () => {
      test.queryBus.on(getComment({ commentId: 'commentId' })).return(undefined);

      await expect(test.createAgent().get(route)).toHaveStatus(404);
    });
  });

  describe('PUT /:commentId', () => {
    const route = '/comment/commentId';

    const body: EditCommentBody = {
      text: 'text',
    };

    it('invokes the editComment command', async () => {
      await expect(test.asUser.put(route, body)).toHaveStatus(204);

      expect(test.commandBus).toInclude(
        editComment({
          commentId: 'commentId',
          authorId: 'userId',
          ...body,
        })
      );
    });

    it('fails with status 401 when the user is not authenticated', async () => {
      await expect(test.createAgent().put(route, body)).toHaveStatus(401);
    });

    it('fails with status 400 when the body is invalid', async () => {
      await expect(test.asUser.put(route, {})).toHaveStatus(400);
    });
  });

  describe('POST /:commentId/reply', () => {
    const route = '/comment/parentId/reply';

    const body: CreateCommentBody = {
      text: 'reply',
    };

    beforeEach(() => {
      test.generator.nextId = 'replyId';
      test.queryBus.on(getComment({ commentId: 'parentId' })).return({ threadId: 'threadId' });
    });

    it('invokes the createComment command', async () => {
      await expect(test.asUser.post(route, body)).toHaveStatus(201);

      expect(test.commandBus).toInclude(
        createComment({
          commentId: 'replyId',
          threadId: 'threadId',
          authorId: 'userId',
          parentId: 'parentId',
          text: 'reply',
        })
      );
    });

    it('returns the created id', async () => {
      const response = await expect(test.asUser.post(route, body)).toHaveStatus(201);

      expect(await response.text()).toEqual('replyId');
    });

    it('fails with status 404 when the parent comment does not exist', async () => {
      test.queryBus.on(getComment({ commentId: 'parentId' })).return(undefined);

      await expect(test.asUser.post(route, body)).toHaveStatus(404);
    });

    it('fails with status 401 when the user is not authenticated', async () => {
      await expect(test.createAgent().post(route, body)).toHaveStatus(401);
    });

    it('fails with status 400 when the body is invalid', async () => {
      await expect(test.asUser.post(route, {})).toHaveStatus(400);
    });
  });

  describe('POST /:commentId/reaction', () => {
    const route = '/comment/commentId/reaction';

    const body: SetReactionBody = {
      type: ReactionType.upvote,
    };

    it('invokes the setReaction command', async () => {
      await expect(test.asUser.post(route, body)).toHaveStatus(204);

      expect(test.commandBus).toInclude(
        setReaction({
          commentId: 'commentId',
          userId: 'userId',
          reactionType: body.type,
        })
      );
    });

    it('fails with status 401 when the user is not authenticated', async () => {
      await expect(test.createAgent().post(route, body)).toHaveStatus(401);
    });

    it('fails with status 400 when the body is invalid', async () => {
      await expect(test.asUser.post(route, {})).toHaveStatus(400);
    });
  });

  describe('POST /:commentId/report', () => {
    const route = '/comment/commentId/report';

    const body: ReportCommentBody = {
      reason: 'reason',
    };

    it('invokes the reportComment command', async () => {
      await expect(test.asUser.post(route, body)).toHaveStatus(204);

      expect(test.commandBus).toInclude(
        reportComment({
          commentId: 'commentId',
          userId: 'userId',
          ...body,
        })
      );
    });

    it('fails with status 401 when the user is not authenticated', async () => {
      await expect(test.createAgent().post(route, body)).toHaveStatus(401);
    });
  });

  describe('POST /:commentId/subscribe', () => {
    const route = '/comment/commentId/subscribe';

    it('invokes the setCommentSubscription command', async () => {
      await expect(test.asUser.post(route)).toHaveStatus(204);

      expect(test.commandBus).toInclude(
        setCommentSubscription({
          commentId: 'commentId',
          userId: 'userId',
          subscribed: true,
        })
      );
    });

    it('fails with status 401 when the user is not authenticated', async () => {
      await expect(test.createAgent().post(route)).toHaveStatus(401);
    });
  });

  describe('POST /:commentId/unsubscribe', () => {
    const route = '/comment/commentId/unsubscribe';

    it('invokes the setCommentSubscription command', async () => {
      await expect(test.asUser.post(route)).toHaveStatus(204);

      expect(test.commandBus).toInclude(
        setCommentSubscription({
          commentId: 'commentId',
          userId: 'userId',
          subscribed: false,
        })
      );
    });

    it('fails with status 401 when the user is not authenticated', async () => {
      await expect(test.createAgent().post(route)).toHaveStatus(401);
    });
  });
});

class Test extends ControllerTest {
  asUser = this.as('userId');

  arrange() {
    this.createUser({ id: 'userId' });
  }
}
