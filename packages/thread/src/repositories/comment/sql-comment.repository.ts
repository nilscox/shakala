import assert from 'assert';

import { Timestamp } from '@shakala/common';
import {
  FindOptions,
  PERSISTENCE_TOKENS,
  SqlComment,
  SqlCommentSubscription,
  SqlMessage,
  SqlReaction,
  SqlRepository,
  SqlThread,
  SqlUser,
} from '@shakala/persistence';
import { CommentSort, getIds, last, Maybe } from '@shakala/shared';
import { injected } from 'brandi';

import { Comment } from '../../entities/comment.entity';
import { Markdown } from '../../entities/markdown.value-object';
import { Message } from '../../entities/message.entity';
import { GetCommentResult } from '../../queries/get-comment';

import { CommentRepository, GetCommentsOptions } from './comment.repository';

export class SqlCommentRepository extends SqlRepository<Comment, SqlComment> implements CommentRepository {
  SqlEntity = SqlComment;

  protected toEntity(sqlComment: SqlComment): Comment {
    return new Comment({
      id: sqlComment.id,
      threadId: sqlComment.thread.id,
      authorId: sqlComment.author.id,
      parentId: sqlComment.parent?.id,
      messages: sqlComment.history.getItems().map(
        (message) =>
          new Message({
            id: message.id,
            authorId: message.author.id,
            date: new Timestamp(message.createdAt),
            text: new Markdown(message.text),
          })
      ),
    });
  }

  protected toSql(comment: Comment) {
    const sqlComment = new SqlComment();

    sqlComment.id = comment.id;
    sqlComment.thread = this.em.getReference(SqlThread, comment.threadId);
    sqlComment.author = this.em.getReference(SqlUser, comment.authorId);
    sqlComment.parent = comment.parentId ? this.em.getReference(SqlComment, comment.parentId) : null;
    sqlComment.createdAt = comment.creationDate.toDate();

    for (const message of [...comment.history, comment.message]) {
      const sqlMessage = new SqlMessage();

      sqlComment.history.add(sqlMessage);

      sqlMessage.id = message.id;
      sqlMessage.author = this.em.getReference(SqlUser, message.authorId);
      sqlMessage.comment;
      sqlMessage.text = message.text.toString();
      sqlMessage.createdAt = message.date.toDate();
    }

    return sqlComment;
  }

  override async save(comment: Comment): Promise<void> {
    await super.save(comment);
    await this.em.upsertMany(this.toSql(comment).history.getItems());
  }

  async findComment(commentId: string, userId?: string): Promise<Maybe<GetCommentResult>> {
    const sqlComment = await this.repository.findOne(commentId);

    if (!sqlComment) {
      return undefined;
    }

    const replies = await this.findComments({ sort: CommentSort.dateAsc, userId }, { parent: sqlComment });

    return {
      ...this.mapCommentResult(sqlComment),
      replies: replies.map((reply) => this.mapCommentResult(reply)),
    };
  }

  async findThreadComments(threadId: string, options: GetCommentsOptions): Promise<GetCommentResult[]> {
    const rootComments = await this.findComments(options, {
      thread: threadId,
      parent: null,
    });

    const replies = await this.findComments(
      { ...options, sort: CommentSort.dateAsc },
      { parent: { $in: getIds(rootComments) } }
    );

    return rootComments.map((comment) => ({
      ...this.mapCommentResult(comment),
      replies: replies
        .filter((reply) => reply.parent === comment)
        .map((reply) => this.mapCommentResult(reply)),
    }));
  }

  private async findComments(
    options: GetCommentsOptions,
    where: FindOptions<SqlComment>
  ): Promise<SqlComment[]> {
    const qb = this.em.createQueryBuilder(SqlComment, 'comment');

    void qb.select('*');
    void qb.where(where);

    void qb.leftJoinAndSelect('author', 'author');
    void qb.leftJoinAndSelect('history', 'commentHistory');

    void qb.orderBy({
      createdAt: options.sort === CommentSort.dateAsc ? 'asc' : 'desc',
      replies: { createdAt: 'asc' },
    });

    if (options.search) {
      const history = {
        text: { $ilike: `%${options.search}%` },
      };

      void qb.andWhere({
        $or: [{ history }, { replies: { history } }],
      });
    }

    if (options.userId) {
      void qb.addSelect(
        this.em
          .createQueryBuilder(SqlReaction, 'reaction')
          .select('type')
          .where({ comment: qb.raw('comment.id'), user: options.userId })
          .getKnexQuery()
          .as('user_reaction')
      );

      void qb.addSelect(
        this.em
          .createQueryBuilder(SqlCommentSubscription, 'subscription')
          .select(qb.raw('true'))
          .where({ comment: qb.raw('comment.id'), user: options.userId })
          .getKnexQuery()
          .as('user_subscribed')
      );
    }

    // logQueryBuilder(qb);

    return qb.getResultList();
  }

  private mapCommentResult(sqlComment: SqlComment): Omit<GetCommentResult, 'replies'> {
    const history = sqlComment.history.getItems();
    const lastMessage = last(history);

    assert(lastMessage, `comment "${sqlComment.id}" has no messages`);

    return {
      id: sqlComment.id,
      threadId: sqlComment.thread.id,
      author: {
        id: sqlComment.author.id,
        nick: sqlComment.author.nick,
        profileImage: `/user/${sqlComment.author.id}/profile-image`,
      },
      text: lastMessage.text,
      date: sqlComment.createdAt.toISOString(),
      edited: false,
      history: history.map((message) => ({
        date: message.createdAt.toISOString(),
        text: message.text,
      })),
      upvotes: Number(sqlComment.upvotes),
      downvotes: Number(sqlComment.downvotes),
      userReaction: sqlComment.userReaction ?? undefined,
      isSubscribed: sqlComment.userSubscribed ?? undefined,
    };
  }
}

injected(SqlCommentRepository, PERSISTENCE_TOKENS.database);
