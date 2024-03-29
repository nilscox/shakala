import assert from 'assert';

import { CommandBus, EntityNotFoundError, GeneratorPort, QueryBus, TOKENS } from '@shakala/common';
import {
  CommentDto,
  createCommentBodySchema,
  createOrEditThreadBodySchema,
  getLastThreadsQuerySchema,
  getThreadQuerySchema,
  ThreadDto,
} from '@shakala/shared';
import {
  getThreadComments,
  createComment,
  createThread,
  getLastThreads,
  getThread,
  editThread,
} from '@shakala/thread';
import { injected } from 'brandi';
import { RequestHandler, Router } from 'express';

import { hasWriteAccess, isAuthenticated } from '../infrastructure/guards';
import { validateRequest } from '../infrastructure/validation';

export class ThreadController {
  public readonly router: Router = Router();

  constructor(
    private readonly generator: GeneratorPort,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {
    const guards = [isAuthenticated, hasWriteAccess];

    this.router.get('/', this.getLastThreads);
    this.router.get('/:threadId', this.getThread);
    this.router.get('/:threadId/comments', this.getThreadComments);
    this.router.post('/', guards, this.createThread);
    this.router.put('/:threadId', guards, this.editThread);
    this.router.post('/:threadId/comment', guards, this.createComment);
  }

  getLastThreads: RequestHandler<unknown, Array<Omit<ThreadDto, 'comments'>>> = async (req, res) => {
    const query = await validateRequest(req).query(getLastThreadsQuerySchema);
    const results = await this.queryBus.execute(getLastThreads(query));

    res.status(200);
    res.send(results);
  };

  getThread: RequestHandler<{ threadId: string }, ThreadDto> = async (req, res) => {
    const thread = await this.queryBus.execute(getThread({ threadId: req.params.threadId }));

    if (!thread) {
      throw new EntityNotFoundError('Thread', { id: req.params.threadId });
    }

    res.status(200);
    res.send(thread);
  };

  getThreadComments: RequestHandler<{ threadId: string }, CommentDto[]> = async (req, res) => {
    const query = await validateRequest(req).query(getThreadQuerySchema);

    const thread = await this.queryBus.execute(getThread({ threadId: req.params.threadId }));

    if (!thread) {
      throw new EntityNotFoundError('Thread', { id: req.params.threadId });
    }

    const comments = await this.queryBus.execute(
      getThreadComments({ threadId: req.params.threadId, userId: req.userId, ...query })
    );

    res.status(200);
    res.send(comments);
  };

  createThread: RequestHandler = async (req, res) => {
    assert(req.userId);

    const body = await validateRequest(req).body(createOrEditThreadBodySchema);
    const threadId = await this.generator.generateId();
    const authorId = req.userId;

    await this.commandBus.execute(createThread({ threadId, authorId, ...body }));

    res.status(201);
    res.send(threadId);
  };

  editThread: RequestHandler<{ threadId: string }> = async (req, res) => {
    assert(req.userId);

    const body = await validateRequest(req).body(createOrEditThreadBodySchema);
    const threadId = req.params.threadId;
    const authorId = req.userId;

    await this.commandBus.execute(editThread({ threadId, authorId, ...body }));

    res.status(204);
    res.end();
  };

  createComment: RequestHandler<{ threadId: string }> = async (req, res) => {
    assert(req.userId);

    const body = await validateRequest(req).body(createCommentBodySchema);
    const commentId = await this.generator.generateId();
    const authorId = req.userId;
    const threadId = req.params.threadId;

    await this.commandBus.execute(createComment({ commentId, authorId, threadId, ...body }));

    res.status(201);
    res.send(commentId);
  };
}

injected(ThreadController, TOKENS.generator, TOKENS.queryBus, TOKENS.commandBus);
