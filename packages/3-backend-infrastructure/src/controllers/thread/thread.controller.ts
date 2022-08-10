import {
  CreateThreadCommand,
  GetLastThreadsQuery,
  GetThreadQuery,
  GetThreadQueryResult,
  Sort,
} from 'backend-application';
import { Thread } from 'backend-domain';
import {
  createThreadBodySchema,
  getLastThreadsQuerySchema,
  getThreadQuerySchema,
  ThreadDto,
  ThreadWithCommentsDto,
} from 'shared';

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
import { LoggerService } from '../../infrastructure/services/logger.service';

import { ThreadPresenter } from './thread.presenter';

export class ThreadController extends Controller {
  constructor(
    logger: LoggerService,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly sessionService: SessionService,
    private readonly validationService: ValidationService,
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
}
