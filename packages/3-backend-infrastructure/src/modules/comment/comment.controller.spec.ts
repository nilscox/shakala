import {
  CreateCommentCommand,
  EditCommentCommand,
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
  Forbidden,
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

  describe('createComment', () => {
    const user = create.user();
    const threadId = 'threadId';
    const parentId = 'parentId';
    const text = 'hello!';

    const commentId = 'commentId';

    let request: MockRequest;

    beforeEach(() => {
      sessionService.user = user;
      commandBus.execute.mockResolvedValue(commentId);
      request = new MockRequest().withBody<CreateCommentBodyDto>({ threadId, text });
    });

    it('creates a new root comment', async () => {
      const response = await controller.createComment(request);

      expect(response).toHaveStatus(201);
      expect(response).toHaveBody(commentId);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new CreateCommentCommand(threadId, user.id, null, text),
      );
    });

    it('creates a new reply', async () => {
      await controller.createComment(request.withBody<CreateCommentBodyDto>({ threadId, text, parentId }));

      expect(commandBus.execute).toHaveBeenCalledWith(
        new CreateCommentCommand(threadId, user.id, parentId, text),
      );
    });

    it('fails to create a comment when the user is not authenticated', async () => {
      sessionService.user = undefined;

      await expect(controller.createComment(request)).rejects.toThrow(Forbidden);
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
    const user = create.user();
    const text = 'updated!';

    const comment = create.comment({
      author: user,
      message: create.message({ text: create.markdown('text') }),
    });

    let request: MockRequest;

    beforeEach(() => {
      sessionService.user = user;
      queryBus.for(GetCommentQuery).return(comment);
      request = new MockRequest().withParam('id', comment.id).withBody<EditCommentBodyDto>({ text });
    });

    it("edits an existing comment's message", async () => {
      const response = await controller.editComment(request);

      expect(response).toHaveStatus(204);
      expect(response).toHaveBody(undefined);

      expect(commandBus.execute).toHaveBeenCalledWith(new EditCommentCommand(comment.id, user.id, text));
    });

    it('fails to edit a comment when the user is not authenticated', async () => {
      sessionService.user = undefined;

      await expect(controller.editComment(request)).rejects.toThrow(Forbidden);
    });

    it('fails to create a comment with an invalid body', async () => {
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
    const user = create.user();
    const type = ReactionType.upvote;

    const comment = create.comment({ author: user });

    let request: MockRequest;

    beforeEach(() => {
      sessionService.user = user;
      queryBus.for(GetCommentQuery).return(comment);
      request = new MockRequest().withParam('id', comment.id).withBody({ type });
    });

    it('sets a reaction on a comment', async () => {
      const response = await controller.setReaction(request);

      expect(response).toHaveStatus(204);
      expect(response).toHaveBody(undefined);

      expect(commandBus.execute).toHaveBeenCalledWith(new SetReactionCommand(user.id, comment.id, type));
    });

    it('fails to set a reaction when the user is not authenticated', async () => {
      sessionService.user = undefined;

      await expect(controller.setReaction(request)).rejects.toThrow(Forbidden);
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
