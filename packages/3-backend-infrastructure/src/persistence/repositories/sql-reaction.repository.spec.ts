import {
  createComment,
  createReaction,
  createReactionsCount,
  createThread,
  createUser,
} from 'backend-application';
import { ReactionType } from 'backend-domain';

import { createTestDatabaseConnection } from '../mikro-orm/create-database-connection';
import { SaveEntity, sqlHelpers } from '../utils/save-test-data';

import { SqlReactionRepository } from './sql-reaction.repository';

describe('SqlReactionRepository', () => {
  let save: SaveEntity;
  let repository: SqlReactionRepository;

  const author = createUser();
  const user = createUser();
  const thread = createThread({ author });

  beforeEach(async () => {
    const { em } = await createTestDatabaseConnection();

    save = sqlHelpers(em.fork()).save;
    repository = new SqlReactionRepository(em.fork());

    await save(author);
    await save(user);
    await save(thread);
  });

  it('saves and finds a reaction', async () => {
    const comment = await save(createComment({ threadId: thread.id, author }));

    const reaction = createReaction({
      commentId: comment.id,
      userId: user.id,
      type: ReactionType.downvote,
    });

    await repository.save(reaction);

    expect(await repository.findById(reaction.id)).toEqual(reaction);
  });

  it('returns the number of reactions for a set of comments', async () => {
    const comment1 = await save(createComment({ threadId: thread.id, author }));
    const comment2 = await save(createComment({ threadId: thread.id, author }));

    const reaction1 = createReaction({
      commentId: comment1.id,
      userId: user.id,
      type: ReactionType.downvote,
    });

    const reaction2 = createReaction({
      commentId: comment2.id,
      userId: user.id,
      type: ReactionType.upvote,
    });

    await save(reaction1);
    await save(reaction2);

    expect(await repository.countReactions([comment1.id, comment2.id])).toEqual(
      new Map([
        [comment1.id, createReactionsCount({ upvote: 0, downvote: 1 })],
        [comment2.id, createReactionsCount({ upvote: 1, downvote: 0 })],
      ]),
    );
  });

  it("returns the user's reactions for a set of comments", async () => {
    const comment1 = await save(createComment({ threadId: thread.id, author }));
    const comment2 = await save(createComment({ threadId: thread.id, author }));

    const reaction1 = createReaction({
      commentId: comment1.id,
      userId: user.id,
      type: ReactionType.downvote,
    });

    const reaction2 = createReaction({
      commentId: comment2.id,
      userId: author.id,
      type: ReactionType.upvote,
    });

    await save(reaction1);
    await save(reaction2);

    expect(await repository.getUserReactions([comment1.id, comment2.id], user.id)).toEqual(
      new Map([
        [comment1.id, ReactionType.downvote],
        [comment2.id, undefined],
      ]),
    );
  });

  it("returns the user's reactions for a set of comments", async () => {
    const comment = await save(createComment({ threadId: thread.id, author }));

    const reaction = createReaction({
      commentId: comment.id,
      userId: user.id,
      type: ReactionType.downvote,
    });

    await save(reaction);

    expect(await repository.getUserReaction(comment.id, user.id)).toEqual(reaction);
  });
});
