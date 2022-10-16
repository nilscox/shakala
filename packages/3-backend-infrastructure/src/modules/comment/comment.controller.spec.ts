import {
  CreateCommentCommand,
  EditCommentCommand,
  ExecutionContext,
  GetCommentQuery,
  ReportCommentCommand,
  SetReactionCommand,
} from 'backend-application';
import {
  CannotReportOwnCommentError,
  CannotSetReactionOnOwnCommentError,
  CommentAlreadyReportedError,
  factories,
  ReactionType,
  UserMustBeAuthorError,
} from 'backend-domain';
import { CreateCommentBodyDto, EditCommentBodyDto, mockReject, mockResolve } from 'shared';

import {
  BadRequest,
  MockLoggerAdapter,
  Unauthorized,
  ValidationError,
  ValidationService,
} from '../../infrastructure';
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
    const parentId = 'parentId';
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

    it('creates a new reply', async () => {
      await controller.createComment(request.withBody<CreateCommentBodyDto>({ threadId, text, parentId }));

      expect(commandBus.execute).toHaveBeenCalledWith(
        new CreateCommentCommand(threadId, parentId, text),
        ctx,
      );
    });

    it('fails to create a comment with an invalid body', async () => {
      const error = await expect
        .rejects(controller.createComment(request.withBody({ threadId })))
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

    it('handles UserMustBeAuthor errors', async () => {
      commandBus.execute = mockReject(new UserMustBeAuthorError());

      const error = await expect.rejects(controller.editComment(request)).with(Unauthorized);

      expect(error).toHaveProperty('body.code', 'UserMustBeAuthor');
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

    it('handles CannotSetReactionOnOwnCommentError', async () => {
      commandBus.execute = mockReject(new CannotSetReactionOnOwnCommentError());

      const error = await expect.rejects(controller.setReaction(request)).with(BadRequest);

      expect(error).toHaveProperty('body.code', 'CannotSetReactionOnOwnComment');
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

    it('throws a BadRequest when the body is not valid', async () => {
      request.withBody({ reason: 42 });

      await expect.rejects(controller.reportComment(request)).with(BadRequest);
    });

    it('handles CommentAlreadyReportedError', async () => {
      commandBus.execute = mockReject(new CommentAlreadyReportedError(comment.id));

      const error = await expect.rejects(controller.reportComment(request)).with(BadRequest);

      expect(error).toHaveProperty('body.code', 'CommentAlreadyReported');
    });

    it('handles CannotReportOwnCommentError', async () => {
      commandBus.execute = mockReject(new CannotReportOwnCommentError(comment.id));

      const error = await expect.rejects(controller.reportComment(request)).with(BadRequest);

      expect(error).toHaveProperty('body.code', 'CannotReportOwnComment');
    });
  });
});
