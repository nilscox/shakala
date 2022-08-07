import { CreateCommentCommand, EditCommentCommand, SetReactionCommand } from 'backend-application';
import { ReactionType, UserMustBeAuthorError } from 'backend-domain';
import { createCommentBodySchema, editCommentBodySchema, setReactionBodySchema } from 'shared';

import {
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
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly sessionService: SessionService,
    private readonly validationService: ValidationService,
  ) {
    super('/comment');
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
    const user = await this.sessionService.requireUser(req);
    const body = await this.validationService.body(req, createCommentBodySchema);

    const commentId = await this.commandBus.execute<string>(
      new CreateCommentCommand(body.threadId, user.id, body.parentId ?? null, body.text),
    );

    return Response.created(commentId);
  }

  async editComment(req: Request): Promise<Response<void>> {
    const commentId = req.params.get('id') as string;
    const user = await this.sessionService.requireUser(req);
    const body = await this.validationService.body(req, editCommentBodySchema);

    await tryCatch(async () => {
      await this.commandBus.execute(new EditCommentCommand(commentId, user.id, body.text));
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
    const user = await this.sessionService.requireUser(req);
    const body = await this.validationService.body(req, setReactionBodySchema);

    await this.commandBus.execute(new SetReactionCommand(user.id, commentId, body.type as ReactionType));

    return Response.noContent();
  }
}
