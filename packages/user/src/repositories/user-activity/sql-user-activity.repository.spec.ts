import expect from '@nilscox/expect';
import { Pagination } from '@shakala/common';
import { createRepositoryTest, RepositoryTest } from '@shakala/persistence';
import { beforeEach, describe, it } from 'vitest';

import { create } from '../../factories';

import { SqlUserActivityRepository } from './sql-user-activity.repository';

describe('SqlUserActivityRepository', () => {
  const getTest = createRepositoryTest(Test);
  let test: Test;

  beforeEach(async () => {
    test = await getTest();
  });

  it('persists a user activity', async () => {
    const user = await test.create.user();
    const userActivity = create.userActivity({ userId: user.id });

    await test.repository.save(userActivity);
    await expect(test.repository.findById(userActivity.id)).toResolve(userActivity);
  });

  it('retrieves the list of activities for a given user', async () => {
    const user = await test.create.user();
    const activity = await test.create.userActivity({ user });

    await expect(test.repository.listUserActivities(user.id, Pagination.firstPage())).toResolve({
      items: [expect.objectWith({ id: activity.id })],
      total: 1,
    });
  });
});

class Test extends RepositoryTest {
  get repository() {
    return new SqlUserActivityRepository(this.database);
  }
}
