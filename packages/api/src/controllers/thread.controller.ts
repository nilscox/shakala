import { CommandBus, GeneratorPort, QueryBus, TOKENS } from '@shakala/common';
import { createCommentBodySchema, createThreadBodySchema } from '@shakala/shared';
import { createComment, createThread } from '@shakala/thread';
import { injected } from 'brandi';
import { RequestHandler, Router } from 'express';

import { hasWriteAccess, isAuthenticated } from '../infrastructure/guards';
import { validateRequestBody } from '../infrastructure/validate-request-body';

export class ThreadController {
  public readonly router: Router = Router();

  constructor(
    private readonly generator: GeneratorPort,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {
    const guards = [isAuthenticated, hasWriteAccess];

    this.router.post('/', guards, this.createThread);
    this.router.post('/:threadId/comment', guards, this.createComment);
  }

  createThread: RequestHandler = async (req, res) => {
    const body = await validateRequestBody(req, createThreadBodySchema);
    const threadId = await this.generator.generateId();
    const authorId = req.userId;

    await this.commandBus.execute(createThread({ threadId, authorId, ...body }));

    res.status(201);
    res.send(threadId);
  };

  createComment: RequestHandler<{ threadId: string }> = async (req, res) => {
    const body = await validateRequestBody(req, createCommentBodySchema);
    const commentId = await this.generator.generateId();
    const authorId = req.userId;
    const threadId = req.params.threadId;

    await this.commandBus.execute(createComment({ commentId, authorId, threadId, ...body }));

    res.status(201);
    res.send(commentId);
  };
}

injected(ThreadController, TOKENS.generator, TOKENS.queryBus, TOKENS.commandBus);
