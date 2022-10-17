import { createDomainDependencies, factories, UserActivity } from 'backend-domain';
import { AuthenticationActivityType, AuthenticationMethod } from 'shared';

import { setupTestDatabase } from '../mikro-orm/create-database-connection';

import { SqlUserActivityRepository } from './sql-user-activity.repository';

describe('SqlUserActivityRepository', () => {
  let repository: SqlUserActivityRepository;

  const deps = createDomainDependencies();
  const create = factories(deps);

  const { getEntityManager, save } = setupTestDatabase();

  beforeEach(async () => {
    const em = getEntityManager();

    repository = new SqlUserActivityRepository(em.fork(), deps);
  });

  it('saves and finds a user activity without payload', async () => {
    const date = new Date('2022-01-01');
    const user = await save(create.user());

    const activity = new UserActivity<AuthenticationActivityType.signOut>({
      id: 'userActivityId',
      type: AuthenticationActivityType.signOut,
      date,
      userId: user.id,
      payload: undefined,
    });

    await repository.save(activity);
    expect(await repository.findById(activity.id)).toEqual(activity);
  });

  it('saves and finds a user activity with a payload', async () => {
    const date = new Date('2022-01-01');
    const user = await save(create.user());

    const activity = new UserActivity<AuthenticationActivityType.signIn>({
      id: 'userActivityId',
      type: AuthenticationActivityType.signIn,
      date,
      userId: user.id,
      payload: {
        method: AuthenticationMethod.emailPassword,
      },
    });

    await repository.save(activity);
    expect(await repository.findById(activity.id)).toEqual(activity);
  });
});
