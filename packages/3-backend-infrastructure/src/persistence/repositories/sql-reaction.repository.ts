import { EntityManager } from '@mikro-orm/postgresql';
import { ReactionRepository, ReactionsCount } from 'backend-application';
import { Reaction, ReactionType } from 'backend-domain';
import { groupBy } from 'shared';

import { EntityMapper } from '../base-classes/entity-mapper';
import { SqlRepository } from '../base-classes/sql-repository';
import { Comment as SqlComment } from '../entities/sql-comment.entity';
import { Reaction as SqlReaction } from '../entities/sql-reaction.entity';
import { User as SqlUser } from '../entities/sql-user.entity';

export class SqlReactionRepository
  extends SqlRepository<SqlReaction, Reaction>
  implements ReactionRepository
{
  constructor(em: EntityManager) {
    super(em.getRepository(SqlReaction), new ReactionEntityMapper(em));
  }

  async countReactions(commentIds: string[]): Promise<Map<string, ReactionsCount>> {
    const reactions = await this.findAllBy({ comment: { id: { $in: commentIds } } });
    const result = new Map<string, ReactionsCount>();

    for (const [commentId, commentReactions] of groupBy(reactions, 'commentId').entries()) {
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
    const reactions = await this.findAllBy({ comment: { id: { $in: commentIds } }, user: { id: userId } });
    const result = new Map<string, ReactionType | undefined>();

    for (const commentId of commentIds) {
      result.set(commentId, reactions.find((reaction) => reaction.commentId === commentId)?.type);
    }

    return result;
  }

  async getUserReaction(commentId: string, userId: string): Promise<Reaction | undefined> {
    return this.findBy({ comment: { id: commentId }, user: { id: userId } });
  }
}

class ReactionEntityMapper implements EntityMapper<SqlReaction, Reaction> {
  constructor(private readonly em: EntityManager) {}

  toSql(entity: Reaction): SqlReaction {
    const sqlReaction = new SqlReaction();

    sqlReaction.id = entity.id;
    sqlReaction.comment = this.em.getReference(SqlComment, entity.commentId);
    sqlReaction.user = this.em.getReference(SqlUser, entity.userId);
    sqlReaction.type = entity.type;

    return sqlReaction;
  }

  fromSql(sqlEntity: SqlReaction): Reaction {
    return new Reaction({
      id: sqlEntity.id,
      commentId: sqlEntity.comment.id,
      userId: sqlEntity.user.id,
      type: sqlEntity.type,
    });
  }
}
