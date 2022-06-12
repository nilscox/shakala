import { Comment, Thread } from 'backend-domain';

import { Query, QueryHandler } from '../cqs/query-handler';
import { CommentRepository, Sort } from '../interfaces/comment.repository';
import { ThreadRepository } from '../interfaces/thread.repository';

export class GetThreadQuery implements Query {
  constructor(
    public readonly threadId: string,
    public readonly sort: Sort,
    public readonly search?: string,
  ) {}
}

export type GetThreadQueryResult = {
  thread: Thread;
  comments: Comment[];
  replies: Map<string, Comment[]>;
};

export class GetThreadHandler implements QueryHandler<GetThreadQuery, GetThreadQueryResult | undefined> {
  constructor(
    private readonly threadRepository: ThreadRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  async handle(query: GetThreadQuery): Promise<GetThreadQueryResult | undefined> {
    const thread = await this.threadRepository.findById(query.threadId);

    if (!thread) {
      return;
    }

    const comments = await this.commentRepository.findForThread(query.threadId, query.sort, query.search);
    const replies = await this.commentRepository.findAllReplies(comments.map((comment) => comment.id));

    return {
      thread,
      comments,
      replies,
    };
  }
}
