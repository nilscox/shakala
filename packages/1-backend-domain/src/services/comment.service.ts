import { CannotSetReactionOnOwnCommentError, CannotReportOwnCommentError } from '@shakala/shared';

import { CommentReport } from '../entities/comment-report.entity';
import { Comment } from '../entities/comment.entity';
import { Reaction, ReactionType } from '../entities/reaction.entity';
import { User } from '../entities/user.entity';
import { CommentReactionSetEvent } from '../events/comment/comment-reaction-set.event';
import { CommentReportedEvent } from '../events/comment/comment-reported.event';
import { GeneratorPort } from '../interfaces/generator.port';

export const del = Symbol('delete');

export class CommentService {
  constructor(private readonly generator: GeneratorPort) {}

  async setUserReaction(
    comment: Comment,
    user: User,
    currentReaction: Reaction | null,
    targetReaction: ReactionType | null,
  ): Promise<Reaction | typeof del | undefined> {
    if (user.equals(comment.author)) {
      throw new CannotSetReactionOnOwnCommentError(comment.id);
    }

    if (!currentReaction && targetReaction) {
      comment.addEvent(new CommentReactionSetEvent(comment.id, user.id, targetReaction));

      return new Reaction({
        id: await this.generator.generateId(),
        commentId: comment.id,
        userId: user.id,
        type: targetReaction,
      });
    }

    if (currentReaction) {
      if (!targetReaction) {
        comment.addEvent(new CommentReactionSetEvent(comment.id, user.id, null));

        return del;
      } else {
        currentReaction.setType(targetReaction);

        comment.addEvent(new CommentReactionSetEvent(comment.id, user.id, targetReaction));

        return currentReaction;
      }
    }

    return;
  }

  async report(comment: Comment, user: User, reason?: string): Promise<CommentReport> {
    if (comment.author.equals(user)) {
      throw new CannotReportOwnCommentError(comment.id);
    }

    comment.addEvent(new CommentReportedEvent(comment.id, user.id, reason));

    return new CommentReport({
      id: await this.generator.generateId(),
      commentId: comment.id,
      reportedBy: user,
      reason: reason ?? null,
    });
  }
}
