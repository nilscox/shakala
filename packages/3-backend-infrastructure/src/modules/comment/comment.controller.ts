import {
  CreateCommentCommand,
  EditCommentCommand,
  ExecutionContext,
  LoggerService,
  SetReactionCommand,
} from 'backend-application';
import { CannotSetReactionOnOwnCommentError, ReactionType, UserMustBeAuthorError } from 'backend-domain';
import { createCommentBodySchema, editCommentBodySchema, setReactionBodySchema } from 'shared';

import {
  BadRequest,
  CommandBus,
  Controller,
  QueryBus,
  Request,
  Response,
  SessionService,
  Unauthorized,
  ValidationService,
} from '../../infrastructure';
import { tryCatch } from '../../utils';

export class CommentController extends Controller {
  constructor(
    logger: LoggerService,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly sessionService: SessionService,
    private readonly validationService: ValidationService,
  ) {
    super(logger, '/comment');
    this.queryBus;
  }

  endpoints() {
    return {
      'POST /': this.createComment,
      'PUT  /:id': this.editComment,
      'PUT  /:id/reaction': this.setReaction,
    };
  }

  async createComment(req: Request): Promise<Response<string>> {
    const user = await this.sessionService.getUser(req);
    const body = await this.validationService.body(req, createCommentBodySchema);

    const commentId = await this.commandBus.execute<string>(
      new CreateCommentCommand(body.threadId, body.parentId ?? null, body.text),
      new ExecutionContext(user),
    );

    return Response.created(commentId);
  }

  async editComment(req: Request): Promise<Response<void>> {
    const commentId = req.params.get('id') as string;
    const user = await this.sessionService.getUser(req);
    const body = await this.validationService.body(req, editCommentBodySchema);

    await tryCatch(async () => {
      await this.commandBus.execute(new EditCommentCommand(commentId, body.text), new ExecutionContext(user));
    })
      .catch(
        UserMustBeAuthorError,
        (error) => new Unauthorized('UserMustBeAuthor', { message: error.message }),
      )
      .run();

    return Response.noContent();
  }

  async setReaction(req: Request): Promise<Response<void>> {
    const commentId = req.params.get('id') as string;
    const user = await this.sessionService.getUser(req);
    const body = await this.validationService.body(req, setReactionBodySchema);

    await tryCatch(async () => {
      await this.commandBus.execute(
        new SetReactionCommand(commentId, body.type as ReactionType),
        new ExecutionContext(user),
      );
    })
      .catch(
        CannotSetReactionOnOwnCommentError,
        (error) => new BadRequest('CannotSetReactionOnOwnComment', { message: error.message }),
      )
      .run();

    return Response.noContent();
  }
}
