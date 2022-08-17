import { ArrayType, Entity, ManyToOne, Property } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { DomainDependencies, Markdown, Thread, Timestamp } from 'backend-domain';

import { BaseSqlEntity } from '../base-classes/base-sql-entity';

import { SqlUser } from './sql-user.entity';

@Entity({ tableName: 'thread' })
export class SqlThread extends BaseSqlEntity<Thread> {
  @ManyToOne({ eager: true })
  author!: SqlUser;

  @Property()
  description!: string;

  @Property({ columnType: 'text' })
  text!: string;

  @Property({ type: ArrayType })
  keywords!: string[];

  assignFromDomain(em: EntityManager, thread: Thread) {
    this.id = thread.id;
    this.description = thread.description;
    this.text = thread.text.toString();
    this.keywords = thread.keywords;
    this.author = em.getReference(SqlUser, thread.author.id);
    this.createdAt = thread.created.toDate();
  }

  toDomain(deps: DomainDependencies) {
    return new Thread({
      id: this.id,
      description: this.description,
      text: new Markdown(this.text),
      keywords: this.keywords,
      author: this.author.toDomain(deps),
      created: new Timestamp(this.createdAt),
    });
  }
}
