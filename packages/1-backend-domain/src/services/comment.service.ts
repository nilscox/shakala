import { CannotReportOwnCommentError, CommentReport } from '../entities/comment-report.entity';
import { Comment } from '../entities/comment.entity';
import { CannotSetReactionOnOwnCommentError, Reaction, ReactionType } from '../entities/reaction.entity';
import { User } from '../entities/user.entity';
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
      throw new CannotSetReactionOnOwnCommentError();
    }

    if (!currentReaction && targetReaction) {
      return new Reaction({
        id: await this.generator.generateId(),
        commentId: comment.id,
        userId: user.id,
        type: targetReaction,
      });
    }

    if (currentReaction) {
      if (!targetReaction) {
        return del;
      } else {
        currentReaction.setType(targetReaction);
        return currentReaction;
      }
    }

    return;
  }

  async report(comment: Comment, user: User, reason?: string): Promise<CommentReport> {
    if (comment.author.equals(user)) {
      throw new CannotReportOwnCommentError(comment.id);
    }

    return new CommentReport({
      id: await this.generator.generateId(),
      commentId: comment.id,
      reportedBy: user,
      reason: reason ?? null,
    });
  }
}
