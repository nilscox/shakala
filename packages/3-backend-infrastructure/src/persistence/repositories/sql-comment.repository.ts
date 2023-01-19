import { QBFilterQuery } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { CommentRepository } from '@shakala/backend-application';
import { Comment, DomainDependencies, ReactionType } from '@shakala/backend-domain';
import { CommentDto, getIds, omit, ReactionTypeDto, ReplyDto, Sort } from '@shakala/shared';

import { BaseSqlRepository } from '../base-classes/base-sql-repository';
import { SqlCommentSubscription, SqlReaction } from '../entities';
import { SqlComment } from '../entities/sql-comment.entity';

type SqlCommentQueryResult = {
  id: string;
  createdAt: Date;
  author: {
    id: string;
    createdAt: Date;
    nick: string;
    profileImage: string | null;
  };
  parent: string | null;
  upvotes: string;
  downvotes: string;
  reply_ids: Array<string> | [null];
  history: Array<{ date: Date; text: string }>;
  user_reaction?: ReactionType;
  user_subscribed?: boolean;
};

export class SqlCommentRepository
  extends BaseSqlRepository<SqlComment, Comment>
  implements CommentRepository
{
  constructor(em: EntityManager, deps: DomainDependencies) {
    super(em, deps, SqlComment);
  }

  protected get entityName(): string {
    return 'Comment';
  }

  private createBaseQueryBuilder(userId?: string) {
    const qb = this.repository.createQueryBuilder('comment');

    void qb.select('comment.*');
    void qb.leftJoinAndSelect('comment.author', 'author');
    void qb.leftJoinAndSelect('comment.history', 'history');

    if (userId) {
      void qb.addSelect(
        this.em
          .createQueryBuilder(SqlReaction, 'reaction')
          .select('type')
          .where({ comment: qb.raw('comment.id'), user: userId })
          .getKnexQuery()
          .as('user_reaction'),
      );

      void qb.addSelect(
        this.em
          .createQueryBuilder(SqlCommentSubscription, 'sub')
          .select('1')
          .where({ comment: qb.raw('comment.id'), user: userId })
          .getKnexQuery()
          .as('user_subscribed'),
      );
    }

    return qb;
  }

  private async findComments(cond: QBFilterQuery<SqlComment>, sort: Sort, userId?: string) {
    const qb = this.createBaseQueryBuilder(userId);

    void qb.andWhere(cond);

    if (sort === Sort.dateAsc) {
      void qb.orderBy({ createdAt: 'asc' });
    } else if (sort === Sort.dateDesc) {
      void qb.orderBy({ createdAt: 'desc' });
    }

    // logQueryBuilder(qb);

    return qb.execute<SqlCommentQueryResult[]>('all');
  }

  private async findRootComments(threadId: string, sort: Sort, userId?: string) {
    return this.findComments({ thread: threadId, parent: { id: null } }, sort, userId);
  }

  private async findReplies(parentIds: string[], userId?: string) {
    return this.findComments({ parent: { $in: parentIds } }, Sort.dateAsc, userId);
  }

  private async searchThreadComments(threadId: string, search: string, sort: Sort, userId?: string) {
    const qb = this.repository.createQueryBuilder('comment');

    void qb.select(['id', 'parent']);

    void qb.where({ thread: threadId });
    void qb.andWhere({ history: { text: { $ilike: `%${search}%` } } });

    const result = await qb.execute<Array<{ id: string; parent: string | null }>>('all');
    const matchingRootCommentsIds = result.map((result) => result.parent ?? result.id);

    return this.findComments(matchingRootCommentsIds, sort, userId);
  }

  async findThreadComments(
    threadId: string,
    sort: Sort,
    search?: string | undefined,
    userId?: string,
  ): Promise<CommentDto[]> {
    const rootComments = search
      ? await this.searchThreadComments(threadId, search, sort, userId)
      : await this.findRootComments(threadId, sort, userId);

    const replies = await this.findReplies(getIds(rootComments), userId);

    return this.commentsToDtos(uniqueBy(rootComments, 'id'), uniqueBy(replies, 'id'));
  }

  private commentsToDtos(comments: SqlCommentQueryResult[], replies: SqlCommentQueryResult[]): CommentDto[] {
    return comments.map((comment) =>
      this.commentToDto(
        comment,
        replies.filter((reply) => reply.parent === comment.id),
      ),
    );
  }

  private commentToDto(comment: SqlCommentQueryResult, replies: SqlCommentQueryResult[]): CommentDto {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const message = comment.history[comment.history.length - 1]!;

    const dto: CommentDto = {
      id: comment.id,
      author: {
        id: comment.author.id,
        nick: comment.author.nick.toString(),
        profileImage: comment.author.profileImage?.toString(),
      },
      date: comment.createdAt.toISOString(),
      text: message.text,
      edited: false,
      history: [],
      replies: replies.map((reply) => this.replyToDto(reply)),
      upvotes: Number(comment.upvotes),
      downvotes: Number(comment.downvotes),
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      userReaction: comment.user_reaction as ReactionTypeDto | undefined,
      isSubscribed: comment.user_subscribed ? true : undefined,
    };

    if (comment.history.length > 1) {
      dto.edited = message.date.toISOString();
      dto.history = comment.history.slice(0, comment.history.length - 1).map((message) => ({
        date: message.date.toISOString(),
        text: message.text,
      }));
    }

    return dto;
  }

  private replyToDto(comment: SqlCommentQueryResult): ReplyDto {
    return omit(this.commentToDto(comment, []), 'replies');
  }
}

const uniqueBy = <T>(items: T[], key: keyof T): T[] => {
  return Array.from(new Map<unknown, T>(items.map((value) => [value[key], value])).values());
};
