import { EntityManager } from '@mikro-orm/postgresql';
import { UserActivityRepository } from 'backend-application';
import { DomainDependencies, UserActivity } from 'backend-domain';

import { BaseSqlRepository } from '../base-classes/base-sql-repository';
import { SqlUserActivity } from '../entities/sql-user-activity.entity';

export class SqlUserActivityRepository
  extends BaseSqlRepository<SqlUserActivity, UserActivity>
  implements UserActivityRepository
{
  constructor(em: EntityManager, deps: DomainDependencies) {
    super(em, deps, SqlUserActivity);
  }

  protected get entityName(): string {
    return 'UserActivity';
  }
}
