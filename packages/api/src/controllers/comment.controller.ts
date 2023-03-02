import { CommandBus, QueryBus, TOKENS } from '@shakala/common';
import { editCommentBodySchema, reportCommentBodySchema, setReactionBodySchema } from '@shakala/shared';
import { editComment, reportComment, setCommentSubscription, setReaction } from '@shakala/thread';
import { injected } from 'brandi';
import { RequestHandler, Router } from 'express';

import { isAuthenticated } from '../infrastructure/guards';
import { validateRequestBody } from '../infrastructure/validate-request-body';

export class CommentController {
  public readonly router: Router = Router();

  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {
    this.router.put('/:commentId', isAuthenticated, this.editComment);
    this.router.post('/:commentId/reaction', isAuthenticated, this.setReaction);
    this.router.post('/:commentId/report', isAuthenticated, this.report);
    this.router.post('/:commentId/subscribe', isAuthenticated, this.subscribe);
    this.router.post('/:commentId/unsubscribe', isAuthenticated, this.unsubscribe);
  }

  editComment: RequestHandler<{ commentId: string }> = async (req, res) => {
    const body = await validateRequestBody(req, editCommentBodySchema);
    const commentId = req.params.commentId;
    const authorId = req.userId;

    await this.commandBus.execute(editComment({ commentId, authorId, ...body }));

    res.status(204);
    res.end();
  };

  setReaction: RequestHandler<{ commentId: string }> = async (req, res) => {
    const body = await validateRequestBody(req, setReactionBodySchema);
    const commentId = req.params.commentId;
    const userId = req.userId;

    await this.commandBus.execute(setReaction({ commentId, userId, reactionType: body.type }));

    res.status(204);
    res.end();
  };

  report: RequestHandler<{ commentId: string }> = async (req, res) => {
    const body = await validateRequestBody(req, reportCommentBodySchema);
    const commentId = req.params.commentId;
    const userId = req.userId;

    await this.commandBus.execute(reportComment({ commentId, userId, ...body }));

    res.status(204);
    res.end();
  };

  subscribe: RequestHandler<{ commentId: string }> = async (req, res) => {
    const commentId = req.params.commentId;
    const userId = req.userId;

    await this.commandBus.execute(setCommentSubscription({ commentId, userId, subscribed: true }));

    res.status(204);
    res.end();
  };

  unsubscribe: RequestHandler<{ commentId: string }> = async (req, res) => {
    const commentId = req.params.commentId;
    const userId = req.userId;

    await this.commandBus.execute(setCommentSubscription({ commentId, userId, subscribed: false }));

    res.status(204);
    res.end();
  };
}

injected(CommentController, TOKENS.queryBus, TOKENS.commandBus);
