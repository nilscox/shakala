import {
  CreateCommentCommand,
  EditCommentCommand,
  ExecutionContext,
  GetCommentQuery,
  SetReactionCommand,
} from 'backend-application';
import {
  CannotSetReactionOnOwnCommentError,
  factories,
  ReactionType,
  UserMustBeAuthorError,
} from 'backend-domain';
import { CreateCommentBodyDto, EditCommentBodyDto } from 'shared';

import {
  BadRequest,
  MockLoggerService,
  Unauthorized,
  ValidationError,
  ValidationService,
} from '../../infrastructure';
import { MockCommandBus, MockQueryBus, MockRequest, StubSessionService } from '../../test';

import { CommentController } from './comment.controller';

describe('CommentController', () => {
  const queryBus = new MockQueryBus();
  const commandBus = new MockCommandBus();
  const sessionService = new StubSessionService();
  const validationService = new ValidationService();

  const controller = new CommentController(
    new MockLoggerService(),
    queryBus,
    commandBus,
    sessionService,
    validationService,
  );

  const create = factories();

  const user = create.user();
  const ctx = new ExecutionContext(user);

  beforeEach(() => {
    sessionService.user = user;
  });

  describe('createComment', () => {
    const threadId = 'threadId';
    const parentId = 'parentId';
    const text = 'hello!';

    const commentId = 'commentId';

    let request: MockRequest;

    beforeEach(() => {
      commandBus.execute.mockResolvedValue(commentId);
      request = new MockRequest().withBody<CreateCommentBodyDto>({ threadId, text });
    });

    it('creates a new root comment', async () => {
      const response = await controller.createComment(request);

      expect(response).toHaveStatus(201);
      expect(response).toHaveBody(commentId);

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
      await expect(controller.createComment(request.withBody({ threadId }))).rejects.test((error) => {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error).toHaveProperty('fields.0.field', 'text');
        expect(error).toHaveProperty('fields.0.error', 'required');
      });
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
      await expect(controller.editComment(request.withBody({}))).rejects.test((error) => {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error).toHaveProperty('fields.0.field', 'text');
        expect(error).toHaveProperty('fields.0.error', 'required');
      });
    });

    it('handles UserMustBeAuthor errors', async () => {
      commandBus.execute.mockRejectedValue(new UserMustBeAuthorError());

      await expect(controller.editComment(request)).rejects.test((error) => {
        expect(error).toBeInstanceOf(Unauthorized);
        expect(error).toHaveProperty('body.message', 'UserMustBeAuthor');
      });
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
      commandBus.execute.mockRejectedValue(new CannotSetReactionOnOwnCommentError());

      await expect(controller.setReaction(request)).rejects.test((error) => {
        expect(error).toBeInstanceOf(BadRequest);
        expect(error).toHaveProperty('body.message', 'CannotSetReactionOnOwnComment');
      });
    });
  });
});
