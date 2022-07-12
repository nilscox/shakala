import { ReactionType } from 'backend-domain';

import { Sort } from '../interfaces/comment.repository';
import { InMemoryCommentRepository } from '../utils/comment.in-memory-repository';
import { createComment, createReaction, createReactionsCount, createThread } from '../utils/factories';
import { InMemoryReactionRepository } from '../utils/reaction.in-memory-repository';
import { InMemoryThreadRepository } from '../utils/thread.in-memory-repository';

import { GetThreadHandler, GetThreadQuery } from './get-thread.query';

describe('GetThreadQuery', () => {
  const threadRepository = new InMemoryThreadRepository();
  const reactionRepository = new InMemoryReactionRepository();
  const commentRepository = new InMemoryCommentRepository(reactionRepository);

  const handler = new GetThreadHandler(threadRepository, commentRepository, reactionRepository);

  const threadId = 'threadId';
  const thread = createThread({ id: threadId });

  const commentId = 'commentId';
  const comment = createComment({ id: commentId, threadId });

  const replyId = 'replyId';
  const reply = createComment({ id: replyId, threadId, parentId: commentId });

  const userId = 'userId';
  const reactionId = 'reactionId';
  const reaction = createReaction({ id: reactionId, commentId, userId, type: ReactionType.upvote });

  beforeEach(() => {
    threadRepository.add(thread);
    commentRepository.add(comment);
    commentRepository.add(reply);
    reactionRepository.add(reaction);
  });

  const execute = async (userId?: string) => {
    return handler.handle(new GetThreadQuery(threadId, Sort.dateAsc, undefined, userId));
  };

  it('retrieves a thread and its comments', async () => {
    const result = await execute();

    expect(result).toEqual({
      thread,
      comments: [comment],
      replies: new Map([[commentId, [reply]]]),
      reactionsCounts: new Map([
        [commentId, createReactionsCount({ [ReactionType.upvote]: 1 })],
        [replyId, createReactionsCount()],
      ]),
      userReactions: undefined,
    });
  });

  it("sets the user's reactions", async () => {
    const userId = 'userId';

    const result = await execute(userId);

    expect(result).toHaveProperty(
      'userReactions',
      new Map([
        [commentId, ReactionType.upvote],
        [replyId, undefined],
      ]),
    );
  });
});
