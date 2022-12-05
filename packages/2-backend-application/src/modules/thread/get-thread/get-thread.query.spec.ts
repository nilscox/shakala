import { factories, ReactionType } from 'backend-domain';

import {
  InMemoryThreadRepository,
  InMemoryReactionRepository,
  InMemoryCommentRepository,
  InMemoryCommentSubscriptionRepository,
} from '../../../adapters';
import { Sort } from '../../../interfaces';

import { GetThreadHandler, GetThreadQuery } from './get-thread.query';

describe('GetThreadQuery', () => {
  const threadRepository = new InMemoryThreadRepository();
  const reactionRepository = new InMemoryReactionRepository();
  const commentRepository = new InMemoryCommentRepository(reactionRepository);
  const commentSubscriptionRepository = new InMemoryCommentSubscriptionRepository();

  const handler = new GetThreadHandler(
    threadRepository,
    commentRepository,
    reactionRepository,
    commentSubscriptionRepository,
  );

  const create = factories();

  const thread = create.thread();
  const comment = create.comment({ threadId: thread.id });
  const reply = create.comment({ threadId: thread.id, parentId: comment.id });

  const userId = 'userId';
  const reaction = create.reaction({ commentId: comment.id, userId, type: ReactionType.upvote });
  const subscription = create.commentSubscription({ commentId: comment.id, userId });

  beforeEach(() => {
    threadRepository.add(thread);
    commentRepository.add(comment);
    commentRepository.add(reply);
    reactionRepository.add(reaction);
    commentSubscriptionRepository.add(subscription);
  });

  const execute = async (userId?: string) => {
    return handler.handle(new GetThreadQuery(thread.id, Sort.dateAsc, undefined, userId));
  };

  it('retrieves a thread and its comments', async () => {
    const result = await execute();

    expect(result).toEqual({
      thread,
      comments: [comment],
      replies: new Map([[comment.id, [reply]]]),
      reactionsCounts: new Map([
        [comment.id, create.reactionsCount({ [ReactionType.upvote]: 1 })],
        [reply.id, create.reactionsCount()],
      ]),
      userReactions: undefined,
      userSubscriptions: undefined,
    });
  });

  it("sets the user's reactions", async () => {
    const userId = 'userId';

    const result = await execute(userId);

    expect(result).toHaveProperty(
      'userReactions',
      new Map([
        [comment.id, ReactionType.upvote],
        [reply.id, undefined],
      ]),
    );
  });

  it("sets the user's subscriptions", async () => {
    const userId = 'userId';

    const result = await execute(userId);

    expect(result).toHaveProperty(
      'userSubscriptions',
      new Map([
        [comment.id, true],
        [reply.id, false],
      ]),
    );
  });
});
