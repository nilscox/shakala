import {
  CreateThreadCommand,
  ExecutionContext,
  GetLastThreadsQuery,
  GetThreadQuery,
  LoggerPort,
  Sort,
} from '@shakala/backend-application';
import {
  createThreadBodySchema,
  getLastThreadsQuerySchema,
  getThreadQuerySchema,
  NotFound,
  ThreadDto,
  ThreadWithCommentsDto,
} from '@shakala/shared';

import {
  CommandBus,
  Controller,
  QueryBus,
  Request,
  Response,
  SessionPort,
  ValidationService,
} from '../../infrastructure';

export class ThreadController extends Controller {
  constructor(
    logger: LoggerPort,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly session: SessionPort,
    private readonly validationService: ValidationService,
  ) {
    super(logger, '/thread');
  }

  /* eslint-disable @typescript-eslint/unbound-method */
  endpoints() {
    return {
      'GET  /last': this.getLastThreads,
      'GET  /:id': this.getThread,
      'POST /': this.createThread,
    };
  }
  /* eslint-enable @typescript-eslint/unbound-method */

  async getLastThreads(req: Request): Promise<Response<ThreadDto[]>> {
    const query = await this.validationService.query(req, getLastThreadsQuerySchema);
    const lastThreads = await this.queryBus.execute<ThreadDto[]>(new GetLastThreadsQuery(query.count));

    return Response.ok(lastThreads);
  }

  async getThread(req: Request): Promise<Response<ThreadWithCommentsDto>> {
    const threadId = req.params.get('id') as string;
    const query = await this.validationService.query(req, getThreadQuerySchema);
    const user = await this.session.getUser(req);

    const result = await this.queryBus.execute<ThreadWithCommentsDto | undefined>(
      new GetThreadQuery(threadId, query.sort as Sort, query.search, user?.id),
    );

    if (!result) {
      throw new NotFound('thread not found', { threadId });
    }

    return Response.ok(result);
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
