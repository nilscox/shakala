import {
  CreateThreadCommand,
  ExecutionContext,
  GetLastThreadsQuery,
  GetThreadQuery,
  GetThreadQueryResult,
  LoggerPort,
  Sort,
} from 'backend-application';
import { Thread } from 'backend-domain';
import {
  createThreadBodySchema,
  getLastThreadsQuerySchema,
  getThreadQuerySchema,
  NotFound,
  ThreadDto,
  ThreadWithCommentsDto,
} from 'shared';

import {
  CommandBus,
  Controller,
  QueryBus,
  Request,
  Response,
  SessionPort,
  ValidationService,
} from '../../infrastructure';

import { ThreadPresenter } from './thread.presenter';

export class ThreadController extends Controller {
  constructor(
    logger: LoggerPort,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly session: SessionPort,
    private readonly validationService: ValidationService,
    private readonly threadPresenter: ThreadPresenter,
  ) {
    super(logger, '/thread');
  }

  endpoints() {
    return {
      'GET  /last': this.getLastThreads,
      'GET  /:id': this.getThread,
      'POST /': this.createThread,
    };
  }

  async getLastThreads(req: Request): Promise<Response<ThreadDto[]>> {
    const query = await this.validationService.query(req, getLastThreadsQuerySchema);
    const lastThreads = await this.queryBus.execute<Thread[]>(new GetLastThreadsQuery(query.count));

    return Response.ok(lastThreads.map(this.threadPresenter.transformThreadSummary));
  }

  async getThread(req: Request): Promise<Response<ThreadWithCommentsDto>> {
    const threadId = req.params.get('id') as string;
    const query = await this.validationService.query(req, getThreadQuerySchema);
    const user = await this.session.getUser(req);

    const result = await this.queryBus.execute<GetThreadQueryResult>(
      new GetThreadQuery(threadId, query.sort as Sort, query.search, user?.id),
    );

    if (!result) {
      throw new NotFound('thread not found', { threadId });
    }

    return Response.ok(this.threadPresenter.transformThread(result));
  }

  async createThread(req: Request): Promise<Response<{ id: string }>> {
    const body = await this.validationService.body(req, createThreadBodySchema);
    const user = await this.session.getUser(req);

    const threadId = await this.commandBus.execute<string>(
      new CreateThreadCommand(body.description, body.text, body.keywords),
      new ExecutionContext(user),
    );

    return Response.created({ id: threadId });
  }
}
