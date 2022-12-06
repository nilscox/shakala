import {
  CommentAlreadySubscribedError,
  CommentNotSubscribedError,
  CreateCommentCommand,
  EditCommentCommand,
  GetCommentQuery,
  GetCommentQueryResult,
  LoggerPort,
  ReportCommentCommand,
  SetCommentSubscriptionCommand,
  SetReactionCommand,
} from 'backend-application';
import {
  CannotReportOwnCommentError,
  CannotSetReactionOnOwnCommentError,
  CommentAlreadyReportedError,
  ReactionType,
  UserMustBeAuthorError,
} from 'backend-domain';
import {
  createCommentBodySchema,
  createReplyBodySchema,
  editCommentBodySchema,
  reportCommentBodySchema,
  setReactionBodySchema,
} from 'shared';

import {
  BadRequest,
  CommandBus,
  Controller,
  NotFound,
  QueryBus,
  Request,
  Response,
  SessionPort,
  Unauthorized,
  ValidationService,
} from '../../infrastructure';
import { execute } from '../../utils';

export class CommentController extends Controller {
  constructor(
    logger: LoggerPort,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly session: SessionPort,
    private readonly validation: ValidationService,
  ) {
    super(logger, '/comment');
    this.queryBus;
  }

  endpoints() {
    return {
      'POST /': this.createComment,
      'PUT  /:id': this.editComment,
      'POST /:id/reply': this.createReply,
      'PUT  /:id/reaction': this.setReaction,
      'POST /:id/subscription': this.subscribe,
      'DELETE /:id/subscription': this.unsubscribe,
      'POST /:id/report': this.reportComment,
    };
  }

  async createComment(req: Request): Promise<Response<{ id: string }>> {
    const user = await this.session.getUser(req);
    const body = await this.validation.body(req, createCommentBodySchema);

    const commentId = await execute<string>(this.commandBus)
      .command(new CreateCommentCommand(body.threadId, body.parentId ?? null, body.text))
      .asUser(user)
      .run();

    return Response.created({ id: commentId });
  }

  async editComment(req: Request): Promise<Response<void>> {
    const commentId = req.params.get('id') as string;
    const user = await this.session.getUser(req);
    const body = await this.validation.body(req, editCommentBodySchema);

    await execute(this.commandBus)
      .command(new EditCommentCommand(commentId, body.text))
      .asUser(user)
      .handle(UserMustBeAuthorError, (error) => new Unauthorized('UserMustBeAuthor', error.message))
      .run();

    return Response.noContent();
  }

  async createReply(req: Request): Promise<Response<{ id: string }>> {
    const parentId = req.params.get('id') as string;
    const user = await this.session.getUser(req);
    const body = await this.validation.body(req, createReplyBodySchema);

    const result = await this.queryBus.execute<GetCommentQueryResult | undefined>(
      new GetCommentQuery(parentId),
    );

    if (!result) {
      throw new NotFound('comment not found', { parentId });
    }

    const { comment: parent } = result;

    const commentId = await execute<string>(this.commandBus)
      .command(new CreateCommentCommand(parent.threadId, parentId, body.text))
      .asUser(user)
      .run();

    return Response.created({ id: commentId });
  }

  async setReaction(req: Request): Promise<Response<void>> {
    const commentId = req.params.get('id') as string;
    const user = await this.session.getUser(req);
    const body = await this.validation.body(req, setReactionBodySchema);

    await execute(this.commandBus)
      .command(new SetReactionCommand(commentId, body.type as ReactionType))
      .asUser(user)
      .handle(
        CannotSetReactionOnOwnCommentError,
        (error) => new BadRequest('CannotSetReactionOnOwnComment', error.message),
      )
      .run();

    return Response.noContent();
  }

  async subscribe(req: Request): Promise<Response<void>> {
    const commentId = req.params.get('id') as string;
    const user = await this.session.getUser(req);

    await execute(this.commandBus)
      .command(new SetCommentSubscriptionCommand(user!.id, commentId, true))
      .asUser(user)
      .handle(
        CommentAlreadySubscribedError,
        (error) => new BadRequest('CommentAlreadySubscribed', error.message, error.details),
      )
      .run();

    return Response.noContent();
  }

  async unsubscribe(req: Request): Promise<Response<void>> {
    const commentId = req.params.get('id') as string;
    const user = await this.session.getUser(req);

    await execute(this.commandBus)
      .command(new SetCommentSubscriptionCommand(user!.id, commentId, false))
      .asUser(user)
      .handle(
        CommentNotSubscribedError,
        (error) => new BadRequest('CommentNotSubscribed', error.message, error.details),
      )
      .run();

    return Response.noContent();
  }

  async reportComment(req: Request): Promise<Response<void>> {
    const commentId = req.params.get('id') as string;
    const user = await this.session.getUser(req);
    const body = await this.validation.body(req, reportCommentBodySchema);

    await execute(this.commandBus)
      .command(new ReportCommentCommand(commentId, body.reason))
      .asUser(user)
      .handle(
        CannotReportOwnCommentError,
        (error) => new BadRequest('CannotReportOwnComment', error.message, error.details),
      )
      .handle(
        CommentAlreadyReportedError,
        (error) => new BadRequest('CommentAlreadyReported', error.message, error.details),
      )
      .run();

    return Response.noContent();
  }
}
