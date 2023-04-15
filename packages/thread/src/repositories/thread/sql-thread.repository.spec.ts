import expect from '@nilscox/expect';
import { createRepositoryTest, RepositoryTest } from '@shakala/persistence/test';
import { beforeEach, describe, it } from 'vitest';

import { create } from '../../factories';

import { SqlThreadRepository } from './sql-thread.repository';

describe('SqlThreadRepository', () => {
  const getTest = createRepositoryTest(Test);
  let test: Test;

  beforeEach(async () => {
    test = await getTest();
  });

  describe('save', () => {
    it('saves and updates a thread', async () => {
      const author = await test.create.user();
      const thread = create.thread({ authorId: author.id });

      await test.repository.save(thread);
      expect(await test.repository.findById(thread.id)).toEqual(thread);

      thread.description = 'updated';
      await test.repository.save(thread);
      await expect(test.repository.findById(thread.id)).toResolve(thread);
    });
  });

  describe('getLastThreads', () => {
    it('retrieves the last threads', async () => {
      const { thread, author } = await test.createThread();

      expect(await test.repository.getLastThreads(1)).toEqual([
        {
          id: thread.id,
          date: thread.createdAt.toISOString(),
          edited: thread.updatedAt.toISOString(),
          author: {
            id: author.id,
            nick: author.nick,
            profileImage: `/user/${author.id}/profile-image`,
          },
          description: thread.description,
          keywords: thread.keywords,
          text: thread.text,
          totalComments: 0,
        },
      ]);
    });
  });

  describe('getThread', () => {
    it('retrieves a thread from its id', async () => {
      const { thread, author } = await test.createThread();
      await test.create.comment({ thread, author });

      expect(await test.repository.getThread(thread.id)).toEqual({
        id: thread.id,
        date: thread.createdAt.toISOString(),
        edited: thread.updatedAt.toISOString(),
        author: {
          id: author.id,
          nick: author.nick,
          profileImage: `/user/${author.id}/profile-image`,
        },
        description: thread.description,
        keywords: thread.keywords,
        text: thread.text,
        totalComments: 1,
      });
    });
  });
});

class Test extends RepositoryTest {
  get repository() {
    return new SqlThreadRepository(this.database);
  }

  async createThread() {
    const author = await this.create.user();
    const thread = await this.create.thread({ author });

    return { author, thread };
  }
}
