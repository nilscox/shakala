import expect from '@nilscox/expect';
import { createRepositoryTest, RepositoryTest } from '@shakala/persistence/test';
import { beforeEach, describe, it } from 'vitest';

import { create } from '../../factories';

import { SqlCommentSubscriptionRepository } from './sql-comment-subscription.repository';

describe('SqlCommentSubscriptionRepository', () => {
  const getTest = createRepositoryTest(Test);
  let test: Test;

  beforeEach(async () => {
    test = await getTest();
  });

  it('saves and finds a comment subscription entity', async () => {
    const user = await test.create.user();
    const { comment } = await test.createComment();

    const subscription = create.commentSubscription({ commentId: comment.id, userId: user.id });

    await test.repository.save(subscription);
    await expect(test.repository.findById(subscription.id)).toResolve(subscription);
  });

  it('finds all subscriptions for a given comment', async () => {
    const user = await test.create.user();
    const { comment } = await test.createComment();
    const subscription = await test.create.commentSubscription({ comment, user });

    const results = await test.repository.findForComment(comment.id);

    expect(results).toHaveLength(1);
    expect(results).toHaveProperty('0.id', subscription.id);
  });

  it('finds a subscription for a given user and comment', async () => {
    const user = await test.create.user();
    const { comment } = await test.createComment();
    const subscription = await test.create.commentSubscription({ comment, user });

    const result = await test.repository.findForUserAndComment(user.id, comment.id);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('id', subscription.id);
  });
});

class Test extends RepositoryTest {
  get repository() {
    return new SqlCommentSubscriptionRepository(this.database);
  }

  async createComment() {
    const author = await this.create.user();
    const thread = await this.create.thread({ author });
    const comment = await this.create.comment({ thread, author });

    return { author, thread, comment };
  }
}
