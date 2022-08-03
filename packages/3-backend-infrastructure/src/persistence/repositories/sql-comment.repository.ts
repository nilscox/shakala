import { EntityManager } from '@mikro-orm/postgresql';
import { CommentRepository, Sort } from 'backend-application';
import { Comment, Markdown, Timestamp } from 'backend-domain';
import { groupBy } from 'shared';

import { EntityMapper } from '../base-classes/entity-mapper';
import { SqlRepository } from '../base-classes/sql-repository';
import { Comment as SqlComment } from '../entities/sql-comment.entity';
import { Thread as SqlThread } from '../entities/sql-thread.entity';
import { User as SqlUser } from '../entities/sql-user.entity';

import { UserEntityMapper } from './sql-user.repository';

export class SqlCommentRepository extends SqlRepository<SqlComment, Comment> implements CommentRepository {
  constructor(em: EntityManager) {
    super(em.getRepository(SqlComment), new CommentEntityMapper(em));
  }

  async findRoots(threadId: string, sort: Sort, search?: string | undefined): Promise<Comment[]> {
    const qb = this.repository.createQueryBuilder('comment');

    qb.select('comment.*');
    qb.leftJoinAndSelect('comment.author', 'author');

    qb.where({ thread: { id: threadId } });
    qb.andWhere({ parent: { id: null } });

    if (sort === Sort.dateAsc) {
      qb.orderBy({ created: 'asc' });
    } else if (sort === Sort.dateDesc) {
      qb.orderBy({ created: 'desc' });
    }

    if (search) {
      qb.andWhere({ text: { $ilike: `%${search}%` } });
    }

    const sqlEntities = await qb.getResult();

    return sqlEntities.map(this.fromSql);
  }

  async findReplies(parentIds: string[]): Promise<Map<string, Comment[]>> {
    const replies = await this.findAllBy({ parent: { $in: parentIds } });

    return groupBy(replies, 'parentId') as Map<string, Comment[]>;
  }
}

class CommentEntityMapper implements EntityMapper<SqlComment, Comment> {
  private userMapper = new UserEntityMapper();

  constructor(private readonly em: EntityManager) {}

  toSql(entity: Comment): SqlComment {
    const sqlComment = new SqlComment();

    sqlComment.id = entity.id;
    sqlComment.thread = this.em.getReference(SqlThread, entity.threadId);
    sqlComment.author = this.em.getReference(SqlUser, entity.author.id);

    if (entity.parentId) {
      sqlComment.parent = this.em.getReference(SqlComment, entity.parentId);
    }

    sqlComment.text = entity.text.toString();
    sqlComment.created = entity.creationDate.toDate();

    return sqlComment;
  }

  fromSql(sqlEntity: SqlComment): Comment {
    return new Comment({
      id: sqlEntity.id,
      threadId: sqlEntity.thread.id,
      author: this.userMapper.fromSql(sqlEntity.author),
      parentId: sqlEntity.parent?.id ?? null,
      text: new Markdown(sqlEntity.text),
      creationDate: new Timestamp(sqlEntity.created),
      lastEditionDate: new Timestamp(sqlEntity.created),
    });
  }
}
