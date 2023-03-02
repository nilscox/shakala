import { EditCommentBody, ReactionType, ReportCommentBody, SetReactionBody } from '@shakala/shared';
import { editComment, reportComment, setCommentSubscription, setReaction } from '@shakala/thread';
import { afterEach, beforeEach, describe, it } from 'vitest';

import { expect } from '../tests/expect';
import { IntegrationTest } from '../tests/integration-test';

describe('[intg] CommentController', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  afterEach(() => test?.cleanup());

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

    it('fails with status 400 when the body is invalid', async () => {
      await expect(test.asUser.post(route, { invalid: true })).toHaveStatus(400);
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

class Test extends IntegrationTest {
  constructor() {
    super();
    this.user = { id: 'userId' };
  }

  asUser = this.as('userId');
}