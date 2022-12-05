import { createDomainDependencies, factories } from 'backend-domain';

import { setupTestDatabase } from '../mikro-orm/create-database-connection';

import { SqlCommentSubscriptionRepository } from './sql-comment-subscription.repository';

describe('SqlCommentSubscriptionRepository', () => {
  let repository: SqlCommentSubscriptionRepository;

  const deps = createDomainDependencies();
  const create = factories(deps);

  const { save, getEntityManager } = setupTestDatabase();

  beforeEach(async () => {
    const em = getEntityManager();

    repository = new SqlCommentSubscriptionRepository(em, deps);
  });

  it('saves and finds a comment subscription', async () => {
    const author = await save(create.user());
    const user = await save(create.user());
    const thread = await save(create.thread({ author }));
    const comment = await save(create.comment({ threadId: thread.id, author }));

    const subscription = create.commentSubscription({
      commentId: comment.id,
      userId: user.id,
    });

    await repository.save(subscription);
    expect(await repository.findById(subscription.id)).toEqual(subscription);
  });

  it('finds the list of subscriptions for a given commentId', async () => {
    const author = await save(create.user());
    const user = await save(create.user());
    const thread = await save(create.thread({ author }));
    const comment = await save(create.comment({ threadId: thread.id, author }));

    const subscription = create.commentSubscription({
      commentId: comment.id,
      userId: user.id,
    });

    await repository.save(subscription);

    expect(await repository.findByCommentId('')).toEqual([]);
    expect(await repository.findByCommentId(comment.id)).toEqual([subscription]);
  });
});
