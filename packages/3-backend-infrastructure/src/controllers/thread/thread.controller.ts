import {
  CreateCommentCommand,
  CreateThreadCommand,
  GetLastThreadsQuery,
  GetThreadQuery,
  GetThreadQueryResult,
  SetReactionCommand,
  Sort,
  UpdateCommentCommand,
} from 'backend-application';
import { ReactionType, Thread, UserMustBeAuthorError } from 'backend-domain';
import {
  createCommentBodySchema,
  createThreadBodySchema,
  getLastThreadsQuerySchema,
  getThreadQuerySchema,
  setReactionBodySchema,
  ThreadDto,
  ThreadWithCommentsDto,
  updateCommentBodySchema,
} from 'shared';

import {
  CommandBus,
  Controller,
  NotFound,
  QueryBus,
  Request,
  Response,
  SessionService,
  Unauthorized,
  ValidationService,
} from '../../infrastructure';
import { tryCatch } from '../../utils';

import { ThreadPresenter } from './thread.presenter';

export class ThreadController extends Controller {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly sessionService: SessionService,
    private readonly validationService: ValidationService,
  ) {
    super('/thread');
  }

  endpoints() {
    return {
      'GET  /last': this.getLastThreads,
      'GET  /:id': this.getThread,
      'POST /': this.createThread,
      'POST /:id/comment': this.createComment,
      'PUT  /:id/comment/:commentId': this.updateComment,
      'PUT  /:id/comment/:commentId/reaction': this.setReaction,
    };
  }

  async getLastThreads(req: Request): Promise<Response<ThreadDto[]>> {
    const query = await this.validationService.query(req, getLastThreadsQuerySchema);
    const lastThreads = await this.queryBus.execute<Thread[]>(new GetLastThreadsQuery(query.count));

    return Response.ok(lastThreads.map(ThreadPresenter.transformThreadSummary));
  }

  async getThread(req: Request): Promise<Response<ThreadWithCommentsDto>> {
    const threadId = req.params.get('id') as string;
    const query = await this.validationService.query(req, getThreadQuerySchema);
    const user = await this.sessionService.getUser(req);

    const result = await this.queryBus.execute<GetThreadQueryResult>(
      new GetThreadQuery(threadId, query.sort as Sort, query.search, user?.id),
    );

    if (!result) {
      throw new NotFound('thread not found', { threadId });
    }

    return Response.ok(ThreadPresenter.transformThread(result));
  }

  async createThread(req: Request): Promise<Response<string>> {
    const body = await this.validationService.body(req, createThreadBodySchema);
    const user = await this.sessionService.requireUser(req);

    const threadId = await this.commandBus.execute<string>(
      new CreateThreadCommand(user.id, body.description, body.text, body.keywords),
    );

    return Response.created(threadId);
  }

  async createComment(req: Request): Promise<Response<string>> {
    const threadId = req.params.get('id') as string;
    const user = await this.sessionService.requireUser(req);
    const body = await this.validationService.body(req, createCommentBodySchema);

    const commentId = await this.commandBus.execute<string>(
      new CreateCommentCommand(threadId, user.id, body.parentId ?? null, body.text),
    );

    return Response.created(commentId);
  }

  async updateComment(req: Request): Promise<Response<void>> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore todo: check that commentId c threadId
    const _threadId = req.params.get('id') as string;
    const commentId = req.params.get('commentId') as string;
    const user = await this.sessionService.requireUser(req);
    const body = await this.validationService.body(req, updateCommentBodySchema);

    await tryCatch(async () => {
      await this.commandBus.execute(new UpdateCommentCommand(commentId, user.id, body.text));
    })
      .catch(
        UserMustBeAuthorError,
        (error) => new Unauthorized('UserMustBeAuthor', { message: error.message }),
      )
      .run();

    return Response.noContent();
  }

  async setReaction(req: Request): Promise<Response<void>> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore todo: check that commentId c threadId
    const _threadId = req.params.get('id') as string;
    const commentId = req.params.get('commentId') as string;
    const user = await this.sessionService.requireUser(req);
    const body = await this.validationService.body(req, setReactionBodySchema);

    await this.commandBus.execute(new SetReactionCommand(user.id, commentId, body.type as ReactionType));

    return Response.noContent();
  }
}
