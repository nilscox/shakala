import expect from '@nilscox/expect';
import { ReactionType } from '@shakala/shared';
import { beforeEach, describe, it } from 'vitest';

import { StubHttpAdapter } from '../../http/stub-http.adapter';

import { ApiCommentAdapter } from './api-comment.adapter';

describe('ApiCommentAdapter', () => {
  let http: StubHttpAdapter;
  let adapter: ApiCommentAdapter;

  beforeEach(() => {
    http = new StubHttpAdapter();
    adapter = new ApiCommentAdapter(http);
  });

  describe('getComment', () => {
    it('retrieves an existing comment', async () => {
      http.response = {
        body: { id: 'commentId' },
      };

      await expect(adapter.getComment('commentId')).toResolve(expect.objectWith({ id: 'commentId' }));

      expect(http.requests).toInclude({ method: 'GET', url: '/comment/commentId' });
    });
  });

  describe('createComment', () => {
    it('creates a new comment', async () => {
      http.response = {
        body: 'commentId',
      };

      await expect(adapter.createComment('threadId', 'text')).toResolve('commentId');

      expect(http.requests).toInclude({
        method: 'POST',
        url: '/thread/threadId/comment',
        body: { text: 'text' },
      });
    });
  });

  describe('createReply', () => {
    it('creates a new reply', async () => {
      http.response = {
        body: 'replyId',
      };

      await expect(adapter.createReply('parentId', 'text')).toResolve('replyId');

      expect(http.requests).toInclude({
        method: 'POST',
        url: '/comment/parentId/reply',
        body: { text: 'text' },
      });
    });
  });

  describe('editComment', () => {
    it('edits a comment', async () => {
      http.response = {};

      await expect(adapter.editComment('commentId', 'text')).toResolve();

      expect(http.requests).toInclude({
        method: 'PUT',
        url: '/comment/commentId',
        body: { text: 'text' },
      });
    });

    it('handles UserMustBeAuthorError', async () => {
      http.error = {
        body: { code: 'UserMustBeAuthorError' },
      };

      await expect(adapter.editComment('commentId', 'text')).toReject(new Error('UserMustBeAuthorError'));
    });
  });

  describe('setReaction', () => {
    beforeEach(() => {
      http.response = {};
    });

    it('sets a reaction to a comment', async () => {
      await expect(adapter.setReaction('commentId', ReactionType.downvote)).toResolve();

      expect(http.requests).toInclude({
        method: 'POST',
        url: '/comment/commentId/reaction',
        body: { type: ReactionType.downvote },
      });
    });

    it('unsets a reaction to a comment', async () => {
      http.response = {
        body: { type: null },
      };

      await expect(adapter.setReaction('commentId', null)).toResolve();

      expect(http.requests).toInclude({
        method: 'POST',
        url: '/comment/commentId/reaction',
        body: { type: null },
      });
    });
  });

  describe('setSubscription', () => {
    beforeEach(() => {
      http.response = {};
    });

    it('subscribes to a comment', async () => {
      await expect(adapter.setSubscription('commentId', true)).toResolve();

      expect(http.requests).toInclude({
        method: 'POST',
        url: '/comment/commentId/subscribe',
      });
    });

    it('removes a subscription to a comment', async () => {
      await expect(adapter.setSubscription('commentId', false)).toResolve();

      expect(http.requests).toInclude({
        method: 'POST',
        url: '/comment/commentId/unsubscribe',
      });
    });
  });

  describe('reportComment', () => {
    beforeEach(() => {
      http.response = {};
    });

    it('reports a comment', async () => {
      await expect(adapter.reportComment('commentId')).toResolve();

      expect(http.requests).toInclude({
        method: 'POST',
        url: '/comment/commentId/report',
        body: {},
      });
    });

    it('reports a comment with a message', async () => {
      http.response = {
        body: { reason: 'reason' },
      };

      await expect(adapter.reportComment('commentId', 'reason')).toResolve();

      expect(http.requests).toInclude({
        method: 'POST',
        url: '/comment/commentId/report',
        body: { reason: 'reason' },
      });
    });

    it('does not fail when the comment was already reported', async () => {
      http.error = {
        body: { code: 'CommentAlreadyReportedError' },
      };

      await expect(adapter.reportComment('commentId')).toResolve();
    });
  });
});
