import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Author, DomainDependencies, Markdown, Message, Timestamp } from '@shakala/backend-domain';

import { BaseSqlEntity } from '../base-classes/base-sql-entity';

import { SqlComment } from './sql-comment.entity';

@Entity({ tableName: 'message' })
export class SqlMessage extends BaseSqlEntity<Message> {
  @ManyToOne()
  comment!: SqlComment;

  @Property({ columnType: 'text' })
  text!: string;

  @Property()
  date!: Date;

  assignFromDomain(_em: EntityManager, message: Message, comment: SqlComment): void {
    this.id = message.id;
    this.comment = comment;
    this.text = message.text.toString();
    this.date = message.date.toDate();
  }

  toDomain(_deps: DomainDependencies, author: Author): Message {
    return new Message({
      id: this.id,
      author,
      date: new Timestamp(this.date),
      text: new Markdown(this.text),
    });
  }
}
