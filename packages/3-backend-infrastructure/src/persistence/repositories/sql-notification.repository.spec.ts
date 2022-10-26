import { Pagination } from 'backend-application';
import { createDomainDependencies, factories, Notification, Timestamp } from 'backend-domain';
import { NotificationType } from 'shared';

import { setupTestDatabase } from '../mikro-orm/create-database-connection';

import { SqlNotificationRepository } from './sql-notification.repository';

describe('SqlNotificationRepository', () => {
  let repository: SqlNotificationRepository;

  const deps = createDomainDependencies();
  const create = factories(deps);

  const { getEntityManager, save } = setupTestDatabase();

  beforeEach(async () => {
    const em = getEntityManager();

    repository = new SqlNotificationRepository(em.fork(), deps);
  });

  it('saves and finds a notification without payload', async () => {
    const date = new Date('2022-01-01');
    const user = await save(create.user());

    const notification = new Notification<NotificationType.rulesUpdated>({
      id: 'notificationId',
      type: NotificationType.rulesUpdated,
      date: new Timestamp(date),
      seenDate: new Timestamp(date),
      userId: user.id,
      payload: { version: '6.9', changes: 'cool things' },
    });

    await repository.save(notification);
    expect(await repository.findById(notification.id)).toEqual(notification);
  });

  it('finds the paginated notifications for a given user', async () => {
    const user = await save(create.user());

    const [notification1, notification2] = await save(
      [new Date('2022-01-01'), new Date('2022-01-02')].map((date) =>
        Notification.create(NotificationType.rulesUpdated, {
          id: create.id(),
          userId: user.id,
          date: new Timestamp(date),
          payload: { version: '6.9', changes: 'cool things' },
        }),
      ),
    );

    expect(await repository.findForUser('notUserId', Pagination.firstPage)).toEqual({ total: 0, items: [] });

    expect(await repository.findForUser(user.id, new Pagination(1, 1))).toEqual({
      total: 2,
      items: [notification2 as Notification],
    });

    expect(await repository.findForUser(user.id, new Pagination(2, 1))).toEqual({
      total: 2,
      items: [notification1 as Notification],
    });
  });

  it('finds the total number of unseen notifications for a given user', async () => {
    const user = await save(create.user());

    await save([
      Notification.create(NotificationType.rulesUpdated, {
        id: create.id(),
        userId: user.id,
        date: new Timestamp('2021-01-01'),
        seenDate: new Timestamp('2021-01-02'),
        payload: { version: '', changes: '' },
      }),
      Notification.create(NotificationType.rulesUpdated, {
        id: create.id(),
        userId: user.id,
        date: new Timestamp('2021-01-01'),
        payload: { version: '', changes: '' },
      }),
    ]);

    expect(await repository.countUnseenForUser(user.id)).toEqual(1);
  });
});
