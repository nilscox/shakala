import { createThread, createUser } from 'backend-application';
import { array } from 'shared';

import { createTestDatabaseConnection } from '../mikro-orm/create-database-connection';
import { SaveEntity, sqlHelpers } from '../utils/save-test-data';

import { SqlThreadRepository } from './sql-thread.repository';

describe('SqlThreadRepository', () => {
  let save: SaveEntity;
  let repository: SqlThreadRepository;

  beforeEach(async () => {
    const { em } = await createTestDatabaseConnection();

    save = sqlHelpers(em.fork()).save;
    repository = new SqlThreadRepository(em.fork());
  });

  it('saves and finds a thread', async () => {
    const author = await save(createUser());
    const thread = createThread({ author });

    await repository.save(thread);
    expect(await repository.findById(thread.id)).toEqual(thread);
  });

  it('finds the last threads', async () => {
    const author = await save(createUser());
    const threads = array(3, () => createThread({ author }));

    for (const thread of threads) {
      await repository.save(thread);
    }

    expect(await repository.findLasts(2)).toEqual([threads[2], threads[1]]);
  });
});
