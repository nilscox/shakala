import assert from 'assert';

import { Timestamp } from '@shakala/common';
import {
  PERSISTENCE_TOKENS,
  SqlComment,
  SqlReaction,
  SqlRepository,
  SqlThread,
  SqlUser,
} from '@shakala/persistence';
import { CommentSort, last, Maybe, omit } from '@shakala/shared';
import { injected } from 'brandi';

import { Markdown } from '../../entities/markdown.value-object';
import { Thread } from '../../entities/thread.entity';
import { GetCommentResult } from '../../queries/get-comment';
import { GetLastThreadsResult } from '../../queries/get-last-threads';
import { GetThreadResult } from '../../queries/get-thread';

import { GetThreadOptions, ThreadRepository } from './thread.repository';

type Defined<T> = Exclude<T, undefined>;

export class SqlThreadRepository extends SqlRepository<Thread, SqlThread> implements ThreadRepository {
  SqlEntity = SqlThread;

  protected toEntity(sqlEntity: SqlThread): Thread {
    return new Thread({
      id: sqlEntity.id,
      description: sqlEntity.description,
      text: new Markdown(sqlEntity.text),
      keywords: sqlEntity.keywords,
      authorId: sqlEntity.author.id,
      created: new Timestamp(sqlEntity.createdAt),
    });
  }

  protected toSql(thread: Thread) {
    return this.em.create(SqlThread, {
      id: thread.id,
      description: thread.description,
      text: thread.text.toString(),
      keywords: thread.keywords,
      author: this.em.getReference(SqlUser, thread.authorId),
      createdAt: thread.created.toDate(),
    } as SqlThread);
  }

  async getLastThreads(count: number): Promise<GetLastThreadsResult> {
    const sqlThreads = await this.repository.findAll({ populate: ['author'], limit: count });

    return sqlThreads.map((sqlThread) => this.getThreadResult(sqlThread));
  }

  async getThread(threadId: string, options: GetThreadOptions): Promise<Maybe<GetThreadResult>> {
    const qb = this.em.createQueryBuilder(SqlThread, 'thread');

    void qb.select('*').where({ id: threadId });

    void qb.leftJoinAndSelect('thread.author', 'author');
    void qb.leftJoinAndSelect('thread.comments', 'comment', { 'comment.parent_id': null });
    void qb.leftJoinAndSelect('comment.history', 'commentHistory');
    void qb.leftJoinAndSelect('comment.replies', 'reply');
    void qb.leftJoinAndSelect('reply.history', 'replyHistory');

    void qb.orderBy({
      comments: {
        createdAt: options.sort === CommentSort.dateAsc ? 'asc' : 'desc',
        replies: { createdAt: 'asc' },
      },
    });

    if (options.search) {
      const history = {
        text: { $ilike: `%${options.search}%` },
      };

      void qb.andWhere({
        comments: {
          history,
          replies: { history },
        },
      });
    }

    const sqlThread = await qb.getSingleResult();

    if (!sqlThread) {
      return undefined;
    }

    const comments = sqlThread.comments.getItems();
    const userReactions = new Map<SqlComment, SqlReaction>();

    if (options.userId) {
      const allComments = comments.flatMap((comment) => [
        comment,
        ...comment.replies.getItems().map((reply) => reply),
      ]);

      const reactions = await this.em.find(SqlReaction, { comment: { $in: allComments } });

      for (const reaction of reactions) {
        userReactions.set(reaction.comment, reaction);
      }
    }

    return {
      ...this.getThreadResult(sqlThread),
      comments: comments.map((comment) => this.getCommentResult(comment, userReactions)),
    };
  }

  private getThreadResult(sqlThread: SqlThread): GetLastThreadsResult[number] {
    return {
      id: sqlThread.id,
      author: {
        id: sqlThread.author.id,
        nick: sqlThread.author.nick,
        profileImage: `/user/${sqlThread.author.id}/profile-image`,
      },
      description: sqlThread.description,
      keywords: sqlThread.keywords,
      text: sqlThread.text,
      date: sqlThread.createdAt.toISOString(),
    };
  }

  private getCommentResult(
    sqlComment: SqlComment,
    userReactions: Map<SqlComment, SqlReaction>
  ): Defined<GetCommentResult> {
    const history = sqlComment.history.getItems();
    const lastMessage = last(history);
    const replies = sqlComment.replies.isInitialized() ? sqlComment.replies.getItems() : [];

    assert(lastMessage, `comment "${sqlComment.id}" has no messages`);

    return {
      id: sqlComment.id,
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
      userReaction: userReactions.get(sqlComment)?.type,
      replies: replies.map((reply) => omit(this.getCommentResult(reply, userReactions), 'replies')),
    };
  }
}

injected(SqlThreadRepository, PERSISTENCE_TOKENS.orm);
