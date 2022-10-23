import { Pagination } from 'backend-application/src/utils/pagination';
import { createDomainDependencies, factories, UserActivity } from 'backend-domain';
import { AuthenticationActivityType, AuthenticationMethod, UserActivityType } from 'shared';

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

  it('finds the paginated activities for a given user', async () => {
    const user = await save(create.user());

    const [activity1, activity2] = await save(
      [new Date('2022-01-01'), new Date('2022-01-02')].map((date) =>
        UserActivity.create(UserActivityType.signUp, {
          id: create.id(),
          userId: user.id,
          date,
          payload: undefined,
        }),
      ),
    );

    expect(await repository.findForUser('notUserId', Pagination.firstPage)).toEqual({ total: 0, items: [] });

    expect(await repository.findForUser(user.id, new Pagination(1, 1))).toEqual({
      total: 2,
      items: [activity2 as UserActivity],
    });

    expect(await repository.findForUser(user.id, new Pagination(2, 1))).toEqual({
      total: 2,
      items: [activity1 as UserActivity],
    });
  });
});
