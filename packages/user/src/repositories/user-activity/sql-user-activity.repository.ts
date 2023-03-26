import { Pagination, Timestamp } from '@shakala/common';
import { PERSISTENCE_TOKENS, SqlRepository, SqlUserActivity } from '@shakala/persistence';
import { injected } from 'brandi';

import { UserActivity, UserActivityPayload, UserActivityType } from '../../entities/user-activity.entity';
import { ListUserActivitiesResult } from '../../queries/list-user-activities';

import { UserActivityRepository } from './user-activity.repository';

export class SqlUserActivityRepository
  extends SqlRepository<UserActivity, SqlUserActivity>
  implements UserActivityRepository
{
  protected SqlEntity = SqlUserActivity;

  protected toEntity(sqlUserActivity: SqlUserActivity): UserActivity {
    return new UserActivity({
      id: sqlUserActivity.id,
      type: sqlUserActivity.type as UserActivityType,
      userId: sqlUserActivity.user.id,
      payload: (sqlUserActivity.payload ?? undefined) as UserActivityPayload[UserActivityType],
      date: new Timestamp(sqlUserActivity.createdAt),
    });
  }

  protected toSql(userActivity: UserActivity): SqlUserActivity {
    return Object.assign(new SqlUserActivity(), {
      id: userActivity.id,
      type: userActivity.type,
      user: this.em.getReference(SqlUserActivity, userActivity.userId),
      payload: userActivity.payload,
      createdAt: userActivity.date,
    });
  }

  async listUserActivities(userId: string, pagination: Pagination): Promise<ListUserActivitiesResult> {
    const [sqlUserActivities, total] = await this.repository.findAndCount(
      { user: userId },
      { limit: pagination.limit, offset: pagination.offset }
    );

    const items = sqlUserActivities.map((activity) => ({
      id: activity.id,
      type: activity.type as UserActivityType,
      date: activity.createdAt.toISOString(),
      payload: (activity.payload ?? undefined) as UserActivityPayload[UserActivityType],
    }));

    return {
      items,
      total,
    };
  }
}

injected(SqlUserActivityRepository, PERSISTENCE_TOKENS.database);
