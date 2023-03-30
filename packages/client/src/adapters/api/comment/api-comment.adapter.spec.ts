import expect from '@nilscox/expect';
import { ReactionType } from '@shakala/shared';
import { beforeEach, describe, it } from 'vitest';

import { MockHttpResponse, StubHttpAdapter } from '../../http/stub-http.adapter';

import { ApiCommentAdapter } from './api-comment.adapter';

describe('ApiCommentAdapter', () => {
  let http: StubHttpAdapter;
  let adapter: ApiCommentAdapter;
  let mockResponse: MockHttpResponse;

  beforeEach(() => {
    http = new StubHttpAdapter();
    adapter = new ApiCommentAdapter(http);
  });

  describe('getComment', () => {
    beforeEach(() => {
      mockResponse = http.mock('GET', '/comment/commentId');
    });

    it('retrieves an existing comment', async () => {
      mockResponse({ body: { id: 'commentId' } });
      await expect(adapter.getComment('commentId')).toResolve(expect.objectWith({ id: 'commentId' }));
    });
  });

  describe('createComment', () => {
    beforeEach(() => {
      mockResponse = http.mock('POST', '/thread/threadId/comment');
    });

    it('creates a new comment', async () => {
      mockResponse({ body: 'commentId' });
      await expect(adapter.createComment('threadId', 'text')).toResolve('commentId');
    });
  });

  describe('createReply', () => {
    beforeEach(() => {
      mockResponse = http.mock('POST', '/comment/parentId/reply');
    });

    it('creates a new reply', async () => {
      mockResponse({ body: 'replyId' });
      await expect(adapter.createReply('parentId', 'text')).toResolve('replyId');
    });
  });

  describe('editComment', () => {
    beforeEach(() => {
      mockResponse = http.mock('PUT', '/comment/commentId');
    });

    it('edits a comment', async () => {
      mockResponse({});
      await expect(adapter.editComment('commentId', 'text')).toResolve();
    });
  });

  describe('setReaction', () => {
    it('sets a reaction to a comment', async () => {
      http.mock('POST', '/comment/commentId/reaction', { body: { type: ReactionType.downvote } })({});
      await expect(adapter.setReaction('commentId', ReactionType.downvote)).toResolve();
    });

    it('unsets a reaction to a comment', async () => {
      http.mock('POST', '/comment/commentId/reaction', { body: { type: null } })({});
      await expect(adapter.setReaction('commentId', null)).toResolve();
    });
  });

  describe('setSubscription', () => {
    it('subscribes to a comment', async () => {
      http.mock('POST', '/comment/commentId/subscribe')({});
      await expect(adapter.setSubscription('commentId', true)).toResolve();
    });

    it('removes a subscription to a comment', async () => {
      http.mock('POST', '/comment/commentId/unsubscribe')({});
      await expect(adapter.setSubscription('commentId', false)).toResolve();
    });
  });

  describe('reportComment', () => {
    it('reports a comment', async () => {
      http.mock('POST', '/comment/commentId/report', { body: { reason: undefined } })({});
      await expect(adapter.reportComment('commentId')).toResolve();
    });

    it('reports a comment with a message', async () => {
      http.mock('POST', '/comment/commentId/report', { body: { reason: 'reason' } })({});
      await expect(adapter.reportComment('commentId', 'reason')).toResolve();
    });

    it('does not fail when the comment was already reported', async () => {
      http.mock('POST', '/comment/commentId/report', { body: { reason: undefined } })({
        status: 400,
        body: { code: 'CommentAlreadyReportedError' },
      });

      await expect(adapter.reportComment('commentId')).toResolve();
    });
  });
});
