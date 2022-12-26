import {
  CreateCommentCommand,
  EditCommentCommand,
  ExecutionContext,
  GetCommentQuery,
  ReportCommentCommand,
  SetCommentSubscriptionCommand,
  SetReactionCommand,
} from 'backend-application';
import { factories, ReactionType } from 'backend-domain';
import { CreateCommentBodyDto, CreateReplyBodyDto, EditCommentBodyDto, NotFound } from 'shared';
import { mockResolve } from 'shared/test';

import { ValidationError, ValidationService } from '../../infrastructure';
import { MockLoggerAdapter } from '../../infrastructure/test';
import { MockCommandBus, MockQueryBus, MockRequest, StubSessionAdapter } from '../../test';

import { CommentController } from './comment.controller';

describe('CommentController', () => {
  const queryBus = new MockQueryBus();
  const commandBus = new MockCommandBus();
  const session = new StubSessionAdapter();
  const validation = new ValidationService();

  const controller = new CommentController(
    new MockLoggerAdapter(),
    queryBus,
    commandBus,
    session,
    validation,
  );

  const create = factories();

  const user = create.user();
  const ctx = new ExecutionContext(user);

  beforeEach(() => {
    session.user = user;
  });

  describe('createComment', () => {
    const threadId = 'threadId';
    const text = 'hello!';

    const commentId = 'commentId';

    let request: MockRequest;

    beforeEach(() => {
      commandBus.execute = mockResolve(commentId);
      request = new MockRequest().withBody<CreateCommentBodyDto>({ threadId, text });
    });

    it('creates a new root comment', async () => {
      const response = await controller.createComment(request);

      expect(response).toHaveStatus(201);
      expect(response).toHaveBody({ id: commentId });

      expect(commandBus.execute).toHaveBeenCalledWith(new CreateCommentCommand(threadId, null, text), ctx);
    });

    it('fails to create a comment with an invalid body', async () => {
      const error = await expect
        .rejects(controller.createComment(request.withBody({ threadId })))
        .with(ValidationError);

      expect(error).toHaveProperty('fields.0.field', 'text');
      expect(error).toHaveProperty('fields.0.error', 'required');
    });
  });

  describe('createReply', () => {
    const threadId = 'threadId';
    const parentId = 'parentId';
    const replyId = 'replyId';
    const text = 'reply';

    let request: MockRequest;

    beforeEach(() => {
      commandBus.execute = mockResolve(replyId);

      request = new MockRequest().withParam('id', parentId).withBody<CreateReplyBodyDto>({ text });
    });

    it('creates a new reply', async () => {
      queryBus.for(GetCommentQuery).return({
        comment: create.comment({ id: parentId, threadId }),
      });

      await controller.createReply(request);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new CreateCommentCommand(threadId, parentId, text),
        ctx,
      );
    });

    it('fails to create a reply when the parent comment does not exist', async () => {
      queryBus.for(GetCommentQuery).return(undefined);

      await expect.rejects(controller.createReply(request)).with(NotFound);
    });

    it('fails to create a reply with an invalid body', async () => {
      const error = await expect
        .rejects(controller.createReply(request.withBody({ text: '' })))
        .with(ValidationError);

      expect(error).toHaveProperty('fields.0.field', 'text');
      expect(error).toHaveProperty('fields.0.error', 'required');
    });
  });

  describe('editComment', () => {
    const text = 'updated!';

    const comment = create.comment({
      author: user,
      message: create.message({ text: create.markdown('text') }),
    });

    let request: MockRequest;

    beforeEach(() => {
      queryBus.for(GetCommentQuery).return(comment);
      request = new MockRequest().withParam('id', comment.id).withBody<EditCommentBodyDto>({ text });
    });

    it("edits an existing comment's message", async () => {
      const response = await controller.editComment(request);

      expect(response).toHaveStatus(204);
      expect(response).toHaveBody(undefined);

      expect(commandBus.execute).toHaveBeenCalledWith(new EditCommentCommand(comment.id, text), ctx);
    });

    it('fails to edit a comment with an invalid body', async () => {
      const error = await expect.rejects(controller.editComment(request.withBody({}))).with(ValidationError);

      expect(error).toHaveProperty('fields.0.field', 'text');
      expect(error).toHaveProperty('fields.0.error', 'required');
    });
  });

  describe('subscribe / unsubscribe', () => {
    const comment = create.comment();

    let request: MockRequest;

    beforeEach(() => {
      queryBus.for(GetCommentQuery).return(comment);
      request = new MockRequest().withParam('id', comment.id);
    });

    it('creates a subscription to a comment', async () => {
      const response = await controller.subscribe(request);

      expect(response).toHaveStatus(204);
      expect(response).toHaveBody(undefined);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new SetCommentSubscriptionCommand(user.id, comment.id, true),
        ctx,
      );
    });

    it('removes a subscription to a comment', async () => {
      const response = await controller.unsubscribe(request);

      expect(response).toHaveStatus(204);
      expect(response).toHaveBody(undefined);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new SetCommentSubscriptionCommand(user.id, comment.id, false),
        ctx,
      );
    });
  });

  describe('setReaction', () => {
    const type = ReactionType.upvote;

    const comment = create.comment({ author: user });

    let request: MockRequest;

    beforeEach(() => {
      queryBus.for(GetCommentQuery).return(comment);
      request = new MockRequest().withParam('id', comment.id).withBody({ type });
    });

    it('sets a reaction on a comment', async () => {
      const response = await controller.setReaction(request);

      expect(response).toHaveStatus(204);
      expect(response).toHaveBody(undefined);

      expect(commandBus.execute).toHaveBeenCalledWith(new SetReactionCommand(comment.id, type), ctx);
    });
  });

  describe('reportComment', () => {
    const comment = create.comment({ author: user });

    let request: MockRequest;

    beforeEach(() => {
      queryBus.for(GetCommentQuery).return(comment);
      request = new MockRequest().withParam('id', comment.id).withBody({});
    });

    it('reports a comment', async () => {
      const response = await controller.reportComment(request);

      expect(response).toHaveStatus(204);
      expect(response).toHaveBody(undefined);

      expect(commandBus.execute).toHaveBeenCalledWith(new ReportCommentCommand(comment.id, undefined), ctx);
    });

    it('throws a ValidationError when the body is not valid', async () => {
      request.withBody({ reason: 42 });

      await expect.rejects(controller.reportComment(request)).with(ValidationError);
    });
  });
});
