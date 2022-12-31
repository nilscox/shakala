import { QueryOrder } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { NotificationRepository, Paginated, Pagination } from '@shakala/backend-application';
import { DomainDependencies, Notification } from '@shakala/backend-domain';

import { BaseSqlRepository } from '../base-classes/base-sql-repository';
import { SqlNotification } from '../entities/sql-notification.entity';

export class SqlNotificationRepository
  extends BaseSqlRepository<SqlNotification, Notification>
  implements NotificationRepository
{
  constructor(em: EntityManager, deps: DomainDependencies) {
    super(em, deps, SqlNotification);
  }

  protected get entityName(): string {
    return 'Notification';
  }

  findForUser(userId: string, { limit, offset }: Pagination): Promise<Paginated<Notification>> {
    return this.findAll(
      {
        user: userId,
      },
      {
        limit,
        offset,
        orderBy: { createdAt: QueryOrder.desc },
      },
    );
  }

  countUnseenForUser(userId: string): Promise<number> {
    return this.repository.count({
      user: userId,
      seenAt: null,
    });
  }
}
