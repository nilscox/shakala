import { AuthorizationError, ReactionType } from 'frontend-domain';

import { StubHttpGateway, StubResponse } from '../http-gateway/stub-http.gateway';

import { ApiCommentGateway, CommentAlreadyReportedError } from './api-comment-gateway';

describe('ApiCommentGateway', () => {
  describe('createReply', () => {
    it('calls the api to create a reply', async () => {
      const http = new StubHttpGateway();
      const gateway = new ApiCommentGateway(http);

      http.for('post', '/comment/commentId/reply').return(StubResponse.created({ id: 'replyId' }));

      const replyId = await gateway.createReply('commentId', "you're right!");

      expect(replyId).toEqual('replyId');
      expect(http.lastRequest).toHaveProperty('options.body', {
        text: "you're right!",
      });
    });
  });

  describe('editComment', () => {
    it('calls the api to edit a comment', async () => {
      const http = new StubHttpGateway();
      const gateway = new ApiCommentGateway(http);

      http.for('put', '/comment/commentId').return(StubResponse.created({ id: 'replyId' }));

      await gateway.editComment('commentId', 'oops, I made a mistake');

      expect(http.lastRequest).toHaveProperty('options.body', {
        text: 'oops, I made a mistake',
      });
    });

    it('throws an authorization error when the call fails with a UserMustBeAuthor error', async () => {
      const http = new StubHttpGateway();
      const gateway = new ApiCommentGateway(http);

      http
        .for('put', '/comment/commentId')
        .throw(StubResponse.create({ status: 401, body: { message: '', code: 'UserMustBeAuthor' } }));

      const error = await expect
        .rejects(gateway.editComment('commentId', 'oops, I made a mistake'))
        .with(AuthorizationError);

      expect(error.reason).toEqual('UserMustBeAuthor');
    });
  });

  describe('setReaction', () => {
    it('calls the api to set a reaction', async () => {
      const http = new StubHttpGateway();
      const gateway = new ApiCommentGateway(http);

      http.for('put', '/comment/commentId/reaction').return(StubResponse.noContent());

      await gateway.setReaction('commentId', ReactionType.upvote);

      expect(http.lastRequest).toHaveProperty('options.body', {
        type: ReactionType.upvote,
      });
    });
  });

  describe('reportComment', () => {
    it('calls the api to report a comment', async () => {
      const http = new StubHttpGateway();
      const gateway = new ApiCommentGateway(http);

      http.for('post', '/comment/commentId/report').return(StubResponse.noContent());

      await gateway.reportComment('commentId');

      expect(http.lastRequest).toHaveProperty('options.body', {
        reason: undefined,
      });
    });

    it('calls the api to report a comment with a reason', async () => {
      const http = new StubHttpGateway();
      const gateway = new ApiCommentGateway(http);

      http.for('post', '/comment/commentId/report').return(StubResponse.noContent());

      await gateway.reportComment('commentId', 'he fought the law');

      expect(http.lastRequest).toHaveProperty('options.body', {
        reason: 'he fought the law',
      });
    });

    it('throw a ValidationError when the comment was already reported', async () => {
      const http = new StubHttpGateway();
      const gateway = new ApiCommentGateway(http);

      http
        .for('post', '/comment/commentId/report')
        .throw(StubResponse.create({ status: 400, body: { message: '', code: 'CommentAlreadyReported' } }));

      await expect.rejects(gateway.reportComment('commentId')).with(CommentAlreadyReportedError);
    });
  });
});