import { SqlComment, SqlReaction, SqlRepository, SqlUser } from '@shakala/persistence';

import { Reaction } from '../../entities/reaction.entity';

import { ReactionRepository } from './reaction.repository';

export class SqlReactionRepository
  extends SqlRepository<Reaction, SqlReaction>
  implements ReactionRepository
{
  SqlEntity = SqlReaction;

  protected toEntity(sqlReaction: SqlReaction): Reaction {
    return new Reaction({
      id: sqlReaction.id,
      userId: sqlReaction.user.id,
      commentId: sqlReaction.comment.id,
      type: sqlReaction.type,
    });
  }

  protected toSql(reaction: Reaction): SqlReaction {
    return Object.assign(new SqlReaction(), {
      id: reaction.id,
      user: this.em.getReference(SqlUser, reaction.userId),
      comment: this.em.getReference(SqlComment, reaction.commentId),
      type: reaction.type,
    });
  }

  async findUserReaction(commentId: string, userId: string): Promise<Reaction | undefined> {
    const sqlReaction = await this.repository.findOne({ comment: commentId, user: userId });

    if (sqlReaction) {
      return this.toEntity(sqlReaction);
    }
  }
}
