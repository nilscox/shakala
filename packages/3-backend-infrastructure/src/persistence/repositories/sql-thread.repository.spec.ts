import { factories } from 'backend-domain';
import { array } from 'shared';

import { setupTestDatabase } from '../mikro-orm/create-database-connection';

import { SqlThreadRepository } from './sql-thread.repository';

describe('SqlThreadRepository', () => {
  let repository: SqlThreadRepository;

  const create = factories();

  const { save, getEntityManager } = setupTestDatabase();

  beforeEach(async () => {
    const em = getEntityManager();

    repository = new SqlThreadRepository(em.fork());
  });

  it('saves and finds a thread', async () => {
    const author = await save(create.user());
    const thread = create.thread({ author });

    await repository.save(thread);
    expect(await repository.findById(thread.id)).toEqual(thread);
  });

  it('finds the last threads', async () => {
    const author = await save(create.user());
    const threads = array(3, () => create.thread({ author }));

    for (const thread of threads) {
      await repository.save(thread);
    }

    expect(await repository.findLasts(2)).toEqual([threads[2], threads[1]]);
  });
});
