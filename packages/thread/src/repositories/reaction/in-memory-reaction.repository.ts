import { InMemoryRepository } from '@shakala/common';

import { Reaction } from '../../entities/reaction.entity';

import { ReactionRepository } from './reaction.repository';

export class InMemoryReactionRepository extends InMemoryRepository<Reaction> implements ReactionRepository {
  entity = Reaction;

  async findUserReaction(commentId: string, userId: string): Promise<Reaction | undefined> {
    return this.find((reaction) => {
      return reaction.commentId === commentId && reaction.userId === userId;
    });
  }
}
