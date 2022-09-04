import { Comment } from '../entities/comment.entity';
import { Reaction, ReactionType } from '../entities/reaction.entity';
import { User } from '../entities/user.entity';
import { GeneratorService } from '../interfaces/generator-service.interface';

export const del = Symbol('delete');

export class CommentService {
  constructor(private readonly generatorService: GeneratorService) {}

  async setUserReaction(
    comment: Comment,
    user: User,
    currentReaction: Reaction | null,
    targetReaction: ReactionType | null,
  ): Promise<Reaction | typeof del | undefined> {
    if (!currentReaction && targetReaction) {
      return new Reaction({
        id: await this.generatorService.generateId(),
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
}
