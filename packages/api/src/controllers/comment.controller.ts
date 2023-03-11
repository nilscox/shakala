import assert from 'assert';

import { CommandBus, EntityNotFoundError, QueryBus, TOKENS } from '@shakala/common';
import { editCommentBodySchema, reportCommentBodySchema, setReactionBodySchema } from '@shakala/shared';
import { editComment, getComment, reportComment, setCommentSubscription, setReaction } from '@shakala/thread';
import { injected } from 'brandi';
import { RequestHandler, Router } from 'express';

import { hasWriteAccess, isAuthenticated } from '../infrastructure/guards';
import { validateRequest } from '../infrastructure/validation';

export class CommentController {
  public readonly router: Router = Router();

  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {
    const guards = [isAuthenticated, hasWriteAccess];

    this.router.get('/:commentId', this.getComment);
    this.router.put('/:commentId', guards, this.editComment);
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

injected(CommentController, TOKENS.queryBus, TOKENS.commandBus);
