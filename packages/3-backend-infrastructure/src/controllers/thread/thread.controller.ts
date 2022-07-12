import {
  CreateCommentCommand,
  GetCommentQuery,
  GetLastThreadsQuery,
  GetThreadQuery,
  GetThreadQueryResult,
  Sort,
  UpdateCommentCommand,
} from 'backend-application';
import { Comment, Thread, UserMustBeAuthorError } from 'backend-domain';
import { CommentDto, ThreadDto, ThreadWithCommentsDto } from 'shared';
import * as yup from 'yup';

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

const getLastThreadQuerySchema = yup.object({
  count: yup.number().min(1).max(50).default(10),
});

const getThreadQuerySchema = yup.object({
  sort: yup.string().oneOf(Object.values(Sort)).default(Sort.relevance),
  search: yup.string().trim().max(30),
});

const createCommentBodySchema = yup
  .object({
    parentId: yup.string(),
    text: yup.string().required().trim().min(4).max(20000),
  })
  .required()
  .noUnknown()
  .strict();

const updateCommentBodySchema = yup
  .object({
    text: yup.string().required().trim().min(4).max(20000),
  })
  .required()
  .noUnknown()
  .strict();

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
      'POST /:id/comment': this.createComment,
      'PUT  /:id/comment/:commentId': this.updateComment,
    };
  }

  async getLastThreads(req: Request): Promise<Response<ThreadDto[]>> {
    const query = await this.validationService.query(req, getLastThreadQuerySchema);
    const lastThreads = await this.queryBus.execute<Thread[]>(new GetLastThreadsQuery(query.count));

    return Response.ok(lastThreads.map((thread) => ThreadPresenter.transformThreadSummary(thread)));
  }

  async getThread(req: Request): Promise<Response<ThreadWithCommentsDto>> {
    const threadId = req.params.get('id') as string;
    const query = await this.validationService.query(req, getThreadQuerySchema);

    const result = await this.queryBus.execute<GetThreadQueryResult>(
      new GetThreadQuery(threadId, query.sort as Sort, query.search),
    );

    if (!result) {
      throw new NotFound('thread not found', { threadId });
    }

    return Response.ok(ThreadPresenter.transformThread(result));
  }

  async createComment(req: Request): Promise<Response<CommentDto>> {
    const threadId = req.params.get('id') as string;
    const user = await this.sessionService.requireUser(req);
    const body = await this.validationService.body(req, createCommentBodySchema);

    const commentId = await this.commandBus.execute<string>(
      new CreateCommentCommand(threadId, user.id, body.parentId ?? null, body.text),
    );

    const comment = await this.queryBus.execute<Comment>(new GetCommentQuery(commentId));

    return Response.created(ThreadPresenter.transformComment(comment));
  }

  async updateComment(req: Request): Promise<Response<CommentDto>> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore todo: check that commentId c threadId
    const threadId = req.params.get('id') as string;
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

    const comment = await this.queryBus.execute<Comment>(new GetCommentQuery(commentId));

    return Response.ok(ThreadPresenter.transformComment(comment));
  }
}
