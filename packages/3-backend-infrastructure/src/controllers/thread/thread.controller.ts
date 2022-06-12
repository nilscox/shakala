import {
  CreateCommentCommand,
  GetCommentQuery,
  GetLastThreadsQuery,
  GetThreadQuery,
  GetThreadQueryResult,
  Sort,
} from 'backend-application';
import { Comment, Thread } from 'backend-domain';
import { CommentDto, ThreadDto, ThreadWithCommentDto } from 'shared';
import * as yup from 'yup';

import {
  CommandBus,
  Controller,
  NotFound,
  QueryBus,
  Request,
  Response,
  SessionService,
  ValidationService,
} from '../../infrastructure';

import { commentToDto, threadToDto, threadToSummaryDto } from './dtos';

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
    };
  }

  async getLastThreads(req: Request): Promise<Response<ThreadDto[]>> {
    const query = await this.validationService.query(req, getLastThreadQuerySchema);
    const lastThreads = await this.queryBus.execute<Thread[]>(new GetLastThreadsQuery(query.count));

    return Response.ok(lastThreads.map((thread) => threadToSummaryDto(thread)));
  }

  async getThread(req: Request): Promise<Response<ThreadWithCommentDto>> {
    const threadId = req.params.get('id') as string;
    const query = await this.validationService.query(req, getThreadQuerySchema);

    const result = await this.queryBus.execute<GetThreadQueryResult>(
      new GetThreadQuery(threadId, query.sort as Sort, query.search),
    );

    if (!result) {
      throw new NotFound('thread not found', { threadId });
    }

    return Response.ok(threadToDto(result.thread, result.comments, result.replies));
  }

  async createComment(req: Request): Promise<Response<CommentDto>> {
    const threadId = req.params.get('id') as string;
    const user = await this.sessionService.requireUser(req);
    const body = await this.validationService.body(req, createCommentBodySchema);

    const commentId = await this.commandBus.execute<string>(
      new CreateCommentCommand(threadId, user.id, body.parentId ?? null, body.text),
    );

    const comment = await this.queryBus.execute<Comment>(new GetCommentQuery(commentId));

    return Response.created(commentToDto(comment));
  }
}
