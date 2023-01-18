import { Collection, Entity, Formula, ManyToOne, OneToMany } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  Author,
  Comment,
  DomainDependencies,
  Nick,
  ProfileImage,
  ReactionType,
} from '@shakala/backend-domain';
import { last } from '@shakala/shared';

import { BaseSqlEntity } from '../base-classes/base-sql-entity';

import { SqlMessage } from './sql-message.entity';
import { SqlThread } from './sql-thread.entity';
import { SqlUser } from './sql-user.entity';

@Entity({ tableName: 'comment' })
export class SqlComment extends BaseSqlEntity<Comment> {
  @ManyToOne()
  thread!: SqlThread;

  @ManyToOne({ eager: true })
  author!: SqlUser;

  @ManyToOne({ nullable: true })
  parent?: SqlComment;

  @OneToMany(() => SqlMessage, (message) => message.comment, { eager: true })
  history = new Collection<SqlMessage>(this);

  @OneToMany(() => SqlComment, (comment) => comment.parent)
  replies = new Collection<SqlComment>(this);

  @Formula(
    (alias) =>
      `(select count(*) from "reaction" where comment_id = ${alias}.id and type = '${ReactionType.upvote}')`,
  )
  upvotes!: number;

  @Formula(
    (alias) =>
      `(select count(*) from "reaction" where comment_id = ${alias}.id and type = '${ReactionType.downvote}')`,
  )
  downvotes!: number;

  assignFromDomain(em: EntityManager, comment: Comment) {
    this.id = comment.id;
    this.thread = em.getReference(SqlThread, comment.threadId);
    this.author = em.getReference(SqlUser, comment.author.id);
    // this.createdAt = comment.creationDate.toDate();

    if (comment.parentId) {
      this.parent = em.getReference(SqlComment, comment.parentId);
    }

    const history = [...comment.history, comment.message].map((message) => {
      if (this.history.getItems().find(({ id }) => id === message.id)) {
        return em.getReference(SqlMessage, message.id);
      }

      const sqlMessage = new SqlMessage();

      sqlMessage.assignFromDomain(em, message, this);

      return sqlMessage;
    });

    this.history = new Collection<SqlMessage>(this, history);
  }

  toDomain(deps: DomainDependencies): Comment {
    const author = new Author({
      id: this.author.id,
      nick: new Nick(this.author.nick),
      profileImage: this.author.profileImage ? new ProfileImage(this.author.profileImage) : null,
    });

    const messages = this.history.getItems();
    const message = last(messages) as SqlMessage;
    const history = messages.slice(0, -1);

    return new Comment(
      {
        id: this.id,
        threadId: this.thread.id,
        author,
        parentId: this.parent?.id ?? null,
        message: message.toDomain(deps, author),
        history: history.map((message) => message.toDomain(deps, author)),
      },
      deps.generator,
      deps.date,
    );
  }
}
