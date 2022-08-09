import { ReactionType, factories } from 'backend-domain';

import { setupTestDatabase } from '../mikro-orm/create-database-connection';

import { SqlReactionRepository } from './sql-reaction.repository';

describe('SqlReactionRepository', () => {
  let repository: SqlReactionRepository;

  const create = factories();

  const author = create.user();
  const user = create.user();
  const thread = create.thread({ author });

  const { save, getEntityManager, waitForDatabaseConnection } = setupTestDatabase();

  beforeEach(async () => {
    await waitForDatabaseConnection();

    const em = getEntityManager();

    repository = new SqlReactionRepository(em.fork());

    await save(author);
    await save(user);
    await save(thread);
  });

  it('saves and finds a reaction', async () => {
    const comment = await save(create.comment({ threadId: thread.id, author }));

    const reaction = create.reaction({
      commentId: comment.id,
      userId: user.id,
      type: ReactionType.downvote,
    });

    await repository.save(reaction);

    expect(await repository.findById(reaction.id)).toEqual(reaction);
  });

  it('returns the number of reactions for a set of comments', async () => {
    const comment1 = await save(create.comment({ threadId: thread.id, author }));
    const comment2 = await save(create.comment({ threadId: thread.id, author }));
    const comment3 = await save(create.comment({ threadId: thread.id, author }));

    const reaction1 = create.reaction({
      commentId: comment1.id,
      userId: user.id,
      type: ReactionType.downvote,
    });

    const reaction2 = create.reaction({
      commentId: comment2.id,
      userId: user.id,
      type: ReactionType.upvote,
    });

    await save(reaction1);
    await save(reaction2);

    expect(await repository.countReactions([comment1.id, comment2.id, comment3.id])).toEqual(
      new Map([
        [comment1.id, create.reactionsCount({ upvote: 0, downvote: 1 })],
        [comment2.id, create.reactionsCount({ upvote: 1, downvote: 0 })],
        [comment3.id, create.reactionsCount({ upvote: 0, downvote: 0 })],
      ]),
    );
  });

  it("returns the user's reactions for a set of comments", async () => {
    const comment1 = await save(create.comment({ threadId: thread.id, author }));
    const comment2 = await save(create.comment({ threadId: thread.id, author }));

    const reaction1 = create.reaction({
      commentId: comment1.id,
      userId: user.id,
      type: ReactionType.downvote,
    });

    const reaction2 = create.reaction({
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
    const comment = await save(create.comment({ threadId: thread.id, author }));

    const reaction = create.reaction({
      commentId: comment.id,
      userId: user.id,
      type: ReactionType.downvote,
    });

    await save(reaction);

    expect(await repository.getUserReaction(comment.id, user.id)).toEqual(reaction);
  });
});
