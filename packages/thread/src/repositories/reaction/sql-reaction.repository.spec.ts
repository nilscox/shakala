import expect from '@nilscox/expect';
import { createRepositoryTest, RepositoryTest } from '@shakala/persistence/test';
import { beforeEach, describe, it } from 'vitest';

import { create } from '../../factories';

import { SqlReactionRepository } from './sql-reaction.repository';

describe('SqlReactionRepository', () => {
  const getTest = createRepositoryTest(Test);
  let test: Test;

  beforeEach(async () => {
    test = await getTest();
  });

  it('saves and finds a reaction entity', async () => {
    const user = await test.create.user();
    const { comment } = await test.createComment();

    const reaction = create.reaction({ commentId: comment.id, userId: user.id });

    await test.repository.save(reaction);
    await expect(test.repository.findById(reaction.id)).toResolve(reaction);
  });

  it('finds a comment report for a given user and comment', async () => {
    const user = await test.create.user();
    const { comment } = await test.createComment();

    const reaction = await test.create.reaction({ comment, user });

    await expect(test.repository.findUserReaction(comment.id, user.id)).toResolve(
      expect.objectWith({ id: reaction.id })
    );
  });
});

class Test extends RepositoryTest {
  get repository() {
    return new SqlReactionRepository(this.database);
  }

  async createComment() {
    const author = await this.create.user();
    const thread = await this.create.thread({ author });
    const comment = await this.create.comment({ thread, author });

    return { author, thread, comment };
  }
}
