import { ReactionType, Reaction, ReactionsCount } from 'backend-domain';
import { createMap } from 'shared';

import { ReactionRepository } from '../interfaces/repositories';
import { InMemoryRepository } from '../utils/in-memory-repository';

export class InMemoryReactionRepository extends InMemoryRepository<Reaction> implements ReactionRepository {
  async countReactions(commentIds: string[]): Promise<Map<string, ReactionsCount>> {
    const countReactionsForType = (commentId: string, type: ReactionType): number => {
      return this.filter((reaction) => reaction.commentId === commentId && reaction.type === type).length;
    };

    return new Map(
      commentIds.map((commentId) => [
        commentId,
        createCommentReactionTypesMap((type) => countReactionsForType(commentId, type)),
      ]),
    );
  }

  async getUserReactions(
    commentIds: string[],
    userId: string,
  ): Promise<Map<string, ReactionType | undefined>> {
    return new Map(
      commentIds.map((commentId) => [
        commentId,
        this.find((reaction) => reaction.commentId === commentId && reaction.userId === userId)?.type,
      ]),
    );
  }

  async getUserReaction(commentId: string, userId: string): Promise<Reaction | undefined> {
    return this.find((reaction) => reaction.commentId === commentId && reaction.userId === userId);
  }
}

const createCommentReactionTypesMap = <T>(getValue: (type: ReactionType) => T): Record<ReactionType, T> => {
  return createMap(Object.values(ReactionType), getValue);
};
