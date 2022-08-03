import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { ReactionType } from 'backend-domain';

import { BaseEntity } from '../base-classes/base-entity';

import { Comment } from './sql-comment.entity';
import { User } from './sql-user.entity';

@Entity({ tableName: 'reaction' })
export class Reaction extends BaseEntity {
  @ManyToOne()
  user!: User;

  @ManyToOne()
  comment!: Comment;

  @Property()
  type!: ReactionType;
}
