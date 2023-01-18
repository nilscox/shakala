import { createDomainDependencies, factories } from '@shakala/backend-domain';
import { array, Sort } from '@shakala/shared';

import { setupTestDatabase } from '../mikro-orm/create-database-connection';

import { SqlCommentRepository } from './sql-comment.repository';
import { SqlThreadRepository } from './sql-thread.repository';

describe('SqlThreadRepository', () => {
  let repository: SqlThreadRepository;

  const deps = createDomainDependencies();
  const create = factories(deps);

  const { save, getEntityManager } = setupTestDatabase();

  beforeEach(async () => {
    const em = getEntityManager();

    const commentRepository = new SqlCommentRepository(em.fork(), deps);
    repository = new SqlThreadRepository(em.fork(), deps, commentRepository);
  });

  describe('getThread', () => {
    it('retrieves a thread from its id', async () => {
      const author = await save(create.user());
      const thread = await save(create.thread({ author }));

      expect(await repository.findThread(thread.id, Sort.dateDesc)).toEqual({
        id: thread.id,
        date: thread.created.toString(),
        author: {
          id: author.id,
          nick: author.nick.toString(),
          profileImage: author.profileImage?.toString(),
        },
        description: thread.description,
        keywords: thread.keywords,
        text: thread.text.toString(),
        comments: [],
      });
    });

    it("retrieves the thread's comments", async () => {
      const author = await save(create.user());
      const thread = await save(create.thread({ author }));
      const comment = await save(create.comment({ threadId: thread.id, author }));

      expect(await repository.findThread(thread.id, Sort.dateAsc)).toHaveProperty(
        'comments.0.id',
        comment.id,
      );
    });
  });

  it('saves and finds a thread', async () => {
    const author = await save(create.user());
    const thread = create.thread({ author });

    await repository.save(thread);
    expect(await repository.findById(thread.id)).toEqual(thread);
  });

  it('finds the last threads', async () => {
    const author = await save(create.user());
    const threads = array(3, (index) =>
      create.thread({ author, created: create.timestamp(`2022-01-${index + 1}`) }),
    );

    for (const thread of threads) {
      await repository.save(thread);
    }

    expect(await repository.findLasts(2)).toEqual([
      expect.objectWith({ id: threads[2]?.id }),
      expect.objectWith({ id: threads[1]?.id }),
    ]);
  });
});
