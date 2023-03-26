import expect from '@nilscox/expect';
import { SqlThread } from '@shakala/persistence/src';
import { createRepositoryTest, RepositoryTest } from '@shakala/persistence/test';
import { CommentSort, first, ReactionType } from '@shakala/shared';
import { beforeEach, describe, it } from 'vitest';

import { create } from '../../factories';

import { SqlCommentRepository } from './sql-comment.repository';

describe('SqlCommentRepository', () => {
  const getTest = createRepositoryTest(Test);
  let test: Test;

  beforeEach(async () => {
    test = await getTest();
  });

  it('saves and finds a comment entity', async () => {
    const user = await test.create.user();
    const { thread } = await test.createThread();

    const comment = create.comment({ authorId: user.id, threadId: thread.id });
    const reply = create.comment({ authorId: user.id, threadId: thread.id, parentId: comment.id });

    await test.repository.save(comment);
    await test.repository.save(reply);

    await expect(test.repository.findById(comment.id)).toResolve(comment);
    await expect(test.repository.findById(reply.id)).toResolve(reply);
  });

  describe('getThreadComments', () => {
    it("retrieves a thread's comments from its id", async () => {
      expect(await test.repository.findThreadComments('threadId', { sort: CommentSort.dateAsc })).toEqual([]);
    });

    it("retrieves a thread's comments sorted by date asc", async () => {
      const { thread } = await test.createThread();
      const { comment1, comment2, reply1, reply2 } = await test.createComments(thread);

      const results = await test.repository.findThreadComments(thread.id, { sort: CommentSort.dateAsc });

      expect(results).toHaveLength(2);
      expect(results).toHaveProperty('0.id', comment1.id);
      expect(results).toHaveProperty('1.id', comment2.id);

      expect(first(results)?.replies).toHaveLength(2);
      expect(results).toHaveProperty('0.replies.0.id', reply1.id);
      expect(results).toHaveProperty('0.replies.1.id', reply2.id);
    });

    it("retrieves a thread's comments sorted by date desc", async () => {
      const { thread } = await test.createThread();
      const { comment1, comment2, reply1, reply2 } = await test.createComments(thread);

      const results = await test.repository.findThreadComments(thread.id, { sort: CommentSort.dateDesc });

      expect(results).toHaveProperty('0.id', comment2.id);
      expect(results).toHaveProperty('1.id', comment1.id);

      expect(results).toHaveProperty('1.replies.0.id', reply1.id);
      expect(results).toHaveProperty('1.replies.1.id', reply2.id);
    });

    it("retrieves a thread's comments matching a search query", async () => {
      const { thread } = await test.createThread();
      const { author, comment1, comment2, reply1, reply2 } = await test.createComments(thread);

      await test.create.message([
        { author, comment: comment1, text: 'match' },
        { author, comment: comment2, text: 'nope' },
        { author, comment: reply1, text: 'match' },
        { author, comment: reply2, text: 'nope' },
      ]);

      const results = await test.repository.findThreadComments(thread.id, {
        sort: CommentSort.dateAsc,
        search: 'match',
      });

      expect(results).toHaveLength(1);
      expect(results).toHaveProperty('0.id', comment1.id);

      expect(first(results)?.replies).toHaveLength(1);
      expect(results).toHaveProperty('0.replies.0.id', reply1.id);
    });

    it("includes information from the user's context", async () => {
      const user = await test.create.user();
      const { thread } = await test.createThread();
      const { comment1, reply1 } = await test.createComments(thread);

      await test.create.reaction({ comment: comment1, user, type: ReactionType.upvote });
      await test.create.reaction({ comment: reply1, user, type: ReactionType.downvote });

      const results = await test.repository.findThreadComments(thread.id, {
        sort: CommentSort.dateAsc,
        userId: user.id,
      });

      expect(results).toHaveProperty('0.upvotes', 1);
      expect(results).toHaveProperty('0.userReaction', ReactionType.upvote);
      expect(results).toHaveProperty('0.replies.0.userReaction', ReactionType.downvote);
    });
  });
});

class Test extends RepositoryTest {
  get repository() {
    return new SqlCommentRepository(this.database);
  }

  async createThread() {
    const author = await this.create.user();
    const thread = await this.create.thread({ author });

    return { author, thread };
  }

  async createComments(thread: SqlThread) {
    const author = await this.create.user();

    const reply1 = await this.create.comment({ thread, author });
    const reply2 = await this.create.comment({ thread, author });
    const comment1 = await this.create.comment({ thread, author, replies: [reply1, reply2] });
    const comment2 = await this.create.comment({ thread, author });

    await this.create.message([
      { author, comment: comment1 },
      { author, comment: comment2 },
      { author, comment: reply1 },
      { author, comment: reply2 },
    ]);

    return { author, comment1, comment2, reply1, reply2 };
  }
}
