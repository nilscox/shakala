import { Comment, ReactionsCount, ReactionType, Thread } from 'backend-domain';
import { getIds } from 'shared';

import { Query, QueryHandler } from '../cqs/query-handler';
import { CommentRepository, Sort } from '../interfaces/repositories';
import { ReactionRepository } from '../interfaces/repositories';
import { ThreadRepository } from '../interfaces/repositories';

export class GetThreadQuery implements Query {
  constructor(
    public readonly threadId: string,
    public readonly sort: Sort,
    public readonly search?: string,
    public readonly userId?: string,
  ) {}
}

export type GetThreadQueryResult = {
  thread: Thread;
  comments: Comment[];
  replies: Map<string, Comment[]>;
  reactionsCounts: Map<string, ReactionsCount>;
  userReactions: Map<string, ReactionType | undefined> | undefined;
};

export class GetThreadHandler implements QueryHandler<GetThreadQuery, GetThreadQueryResult | undefined> {
  constructor(
    private readonly threadRepository: ThreadRepository,
    private readonly commentRepository: CommentRepository,
    private readonly reactionRepository: ReactionRepository,
  ) {}

  async handle(query: GetThreadQuery): Promise<GetThreadQueryResult | undefined> {
    const { threadId, sort, search, userId } = query;

    const thread = await this.threadRepository.findById(threadId);

    if (!thread) {
      return;
    }

    const comments = await this.commentRepository.findRoots(threadId, sort, search);
    const replies = await this.commentRepository.findReplies(getIds(comments));
    const ids = getIds([...comments, ...replies.values()].flat());

    const reactionsCounts = await this.reactionRepository.countReactions(ids);
    const userReactions = userId ? await this.reactionRepository.getUserReactions(ids, userId) : undefined;

    return {
      thread,
      comments,
      replies,
      reactionsCounts,
      userReactions,
    };
  }
}
