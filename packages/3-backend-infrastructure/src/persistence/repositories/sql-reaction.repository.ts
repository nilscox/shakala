import { EntityManager } from '@mikro-orm/postgresql';
import { ReactionRepository, ReactionsCount } from 'backend-application';
import { Reaction, ReactionType } from 'backend-domain';
import { groupBy } from 'shared';

import { BaseSqlRepository } from '../base-classes/base-sql-repository';
import { SqlReaction } from '../entities/sql-reaction.entity';

export class SqlReactionRepository
  extends BaseSqlRepository<SqlReaction, Reaction>
  implements ReactionRepository
{
  constructor(em: EntityManager) {
    super(em, SqlReaction);
  }

  protected get entityName(): string {
    return 'Reaction';
  }

  async countReactions(commentIds: string[]): Promise<Map<string, ReactionsCount>> {
    const reactions = this.toDomain(await this.repository.find({ comment: { id: { $in: commentIds } } }));
    const mapByCommentId = groupBy(reactions, 'commentId');
    const result = new Map<string, ReactionsCount>();

    for (const commentId of commentIds) {
      const commentReactions = mapByCommentId.get(commentId) ?? [];

      result.set(commentId, {
        [ReactionType.upvote]: commentReactions.filter(({ type }) => type === ReactionType.upvote).length,
        [ReactionType.downvote]: commentReactions.filter(({ type }) => type === ReactionType.downvote).length,
      });
    }

    return result;
  }

  async getUserReactions(
    commentIds: string[],
    userId: string,
  ): Promise<Map<string, ReactionType | undefined>> {
    const reactions = this.toDomain(
      await this.repository.find({ comment: { id: { $in: commentIds } }, user: { id: userId } }),
    );
    const result = new Map<string, ReactionType | undefined>();

    for (const commentId of commentIds) {
      result.set(commentId, reactions.find((reaction) => reaction.commentId === commentId)?.type);
    }

    return result;
  }

  async getUserReaction(commentId: string, userId: string): Promise<Reaction | undefined> {
    return this.toDomain(await this.repository.findOne({ comment: { id: commentId }, user: { id: userId } }));
  }
}
