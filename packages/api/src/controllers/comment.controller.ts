import assert from 'assert';

import { CommandBus, EntityNotFoundError, GeneratorPort, QueryBus, TOKENS } from '@shakala/common';
import {
  createCommentBodySchema,
  editCommentBodySchema,
  reportCommentBodySchema,
  setReactionBodySchema,
} from '@shakala/shared';
import {
  createComment,
  editComment,
  getComment,
  reportComment,
  setCommentSubscription,
  setReaction,
} from '@shakala/thread';
import { injected } from 'brandi';
import { RequestHandler, Router } from 'express';

import { hasWriteAccess, isAuthenticated } from '../infrastructure/guards';
import { validateRequest } from '../infrastructure/validation';

export class CommentController {
  public readonly router: Router = Router();

  constructor(
    private readonly generator: GeneratorPort,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {
    const guards = [isAuthenticated, hasWriteAccess];

    this.router.get('/:commentId', this.getComment);
    this.router.put('/:commentId', guards, this.editComment);
    this.router.post('/:parentId/reply', guards, this.createReply);
    this.router.post('/:commentId/reaction', guards, this.setReaction);
    this.router.post('/:commentId/report', guards, this.report);
    this.router.post('/:commentId/subscribe', guards, this.subscribe);
    this.router.post('/:commentId/unsubscribe', guards, this.unsubscribe);
  }

  getComment: RequestHandler<{ commentId: string }> = async (req, res) => {
    const result = await this.queryBus.execute(
      getComment({ commentId: req.params.commentId, userId: req.userId })
    );

    if (!result) {
      throw new EntityNotFoundError('Comment', { id: req.params.commentId });
    }

    res.status(200);
    res.json(result);
  };

  editComment: RequestHandler<{ commentId: string }> = async (req, res) => {
    assert(req.userId);

    const body = await validateRequest(req).body(editCommentBodySchema);
    const commentId = req.params.commentId;
    const authorId = req.userId;

    await this.commandBus.execute(editComment({ commentId, authorId, ...body }));

    res.status(204);
    res.end();
  };

  createReply: RequestHandler<{ parentId: string }> = async (req, res) => {
    assert(req.userId);

    const body = await validateRequest(req).body(createCommentBodySchema);
    const parentId = req.params.parentId;
    const authorId = req.userId;

    const parent = await this.queryBus.execute(getComment({ commentId: parentId }));

    if (!parent) {
      throw new EntityNotFoundError('Comment', { id: parentId });
    }

    const replyId = await this.generator.generateId();

    await this.commandBus.execute(
      createComment({
        threadId: parent.threadId,
        commentId: replyId,
        authorId,
        parentId,
        ...body,
      })
    );

    res.status(201);
    res.send(replyId);
  };

  setReaction: RequestHandler<{ commentId: string }> = async (req, res) => {
    assert(req.userId);

    const body = await validateRequest(req).body(setReactionBodySchema);
    const commentId = req.params.commentId;
    const userId = req.userId;

    await this.commandBus.execute(setReaction({ commentId, userId, reactionType: body.type }));

    res.status(204);
    res.end();
  };

  report: RequestHandler<{ commentId: string }> = async (req, res) => {
    assert(req.userId);

    const body = await validateRequest(req).body(reportCommentBodySchema);
    const commentId = req.params.commentId;
    const userId = req.userId;

    await this.commandBus.execute(reportComment({ commentId, userId, ...body }));

    res.status(204);
    res.end();
  };

  subscribe: RequestHandler<{ commentId: string }> = async (req, res) => {
    assert(req.userId);

    const commentId = req.params.commentId;
    const userId = req.userId;

    await this.commandBus.execute(setCommentSubscription({ commentId, userId, subscribed: true }));

    res.status(204);
    res.end();
  };

  unsubscribe: RequestHandler<{ commentId: string }> = async (req, res) => {
    assert(req.userId);

    const commentId = req.params.commentId;
    const userId = req.userId;

    await this.commandBus.execute(setCommentSubscription({ commentId, userId, subscribed: false }));

    res.status(204);
    res.end();
  };
}

injected(CommentController, TOKENS.generator, TOKENS.queryBus, TOKENS.commandBus);
