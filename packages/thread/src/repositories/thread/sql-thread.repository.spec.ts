import expect from '@nilscox/expect';
import { RepositoryTest, SqlThread } from '@shakala/persistence';
import { CommentSort } from '@shakala/shared';
import { beforeEach, describe, it } from 'vitest';

import { SqlThreadRepository } from './sql-thread.repository';

describe('SqlThreadRepository', () => {
  let test: Test;

  beforeEach(async () => {
    test = new Test();
    await test.setup();
  });

  describe('getLastThreads', () => {
    it('retrieves the last threads', async () => {
      const { thread, author } = await test.createThread();

      expect(await test.repository.getLastThreads(1)).toEqual([
        {
          id: thread.id,
          date: thread.createdAt.toISOString(),
          author: {
            id: author.id,
            nick: author.nick,
            profileImage: '',
          },
          description: thread.description,
          keywords: thread.keywords,
          text: thread.text,
        },
      ]);
    });
  });

  describe('getThread', () => {
    it('retrieves a thread from its id', async () => {
      const { thread, author } = await test.createThread();

      expect(await test.repository.getThread('threadId', { sort: CommentSort.dateAsc })).toEqual({
        id: thread.id,
        date: thread.createdAt.toISOString(),
        author: {
          id: author.id,
          nick: author.nick,
          profileImage: '',
        },
        description: thread.description,
        keywords: thread.keywords,
        text: thread.text,
        comments: [],
      });
    });

    it("retrieves a thread's comments sorted by date asc", async () => {
      const { thread } = await test.createThread();
      const { comment1, comment2, reply1, reply2 } = await test.createComments(thread);

      const retrieved = await test.repository.getThread('threadId', { sort: CommentSort.dateAsc });

      expect(retrieved).toHaveProperty('comments.0.id', comment1.id);
      expect(retrieved).toHaveProperty('comments.1.id', comment2.id);
      expect(retrieved?.comments).toHaveLength(2);

      expect(retrieved).toHaveProperty('comments.0.replies.0.id', reply1.id);
      expect(retrieved).toHaveProperty('comments.0.replies.1.id', reply2.id);
      expect(retrieved?.comments[0]?.replies).toHaveLength(2);
    });

    it("retrieves a thread's comments sorted by date desc", async () => {
      const { thread } = await test.createThread();
      const { comment1, comment2, reply1, reply2 } = await test.createComments(thread);

      const retrieved = await test.repository.getThread('threadId', { sort: CommentSort.dateDesc });

      expect(retrieved).toHaveProperty('comments.0.id', comment2.id);
      expect(retrieved).toHaveProperty('comments.1.id', comment1.id);

      expect(retrieved).toHaveProperty('comments.1.replies.0.id', reply1.id);
      expect(retrieved).toHaveProperty('comments.1.replies.1.id', reply2.id);
    });

    it("retrieves a thread's comments matching a search query", async () => {
      const { thread } = await test.createThread();
      const { comment1, comment2, reply1, reply2 } = await test.createComments(thread);

      await test.create.message([
        { comment: comment1, text: 'match' },
        { comment: comment2, text: 'nope' },
        { comment: reply1, text: 'match' },
        { comment: reply2, text: 'nope' },
      ]);

      const retrieved = await test.repository.getThread('threadId', {
        sort: CommentSort.dateAsc,
        search: 'match',
      });

      expect(retrieved).toHaveProperty('comments.0.id', comment1.id);
      expect(retrieved?.comments).toHaveLength(1);

      expect(retrieved).toHaveProperty('comments.0.replies.0.id', reply1.id);
      expect(retrieved?.comments[0]?.replies).toHaveLength(1);
    });
  });
});

class Test extends RepositoryTest {
  get repository() {
    return new SqlThreadRepository(this.orm);
  }

  async createThread() {
    const author = await this.create.user();
    const thread = await this.create.thread({ id: 'threadId', author });

    return { author, thread };
  }

  async createComments(thread: SqlThread) {
    const author = await this.create.user();

    const reply1 = await this.create.comment({ thread, author });
    const reply2 = await this.create.comment({ thread, author });
    const comment1 = await this.create.comment({ thread, author, replies: [reply1, reply2] });
    const comment2 = await this.create.comment({ thread, author });

    await this.create.message([
      { comment: comment1 },
      { comment: comment2 },
      { comment: reply1 },
      { comment: reply2 },
    ]);

    return { comment1, comment2, reply1, reply2 };
  }
}
