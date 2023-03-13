import { InMemoryRepository, PaginatedItem, Pagination } from '@shakala/common';

import { UserActivity } from '../../entities/user-activity.entity';
import { ListUserActivitiesResult } from '../../queries/list-user-activities';

import { UserActivityRepository } from './user-activity.repository';

export class InMemoryUserActivityRepository
  extends InMemoryRepository<UserActivity>
  implements UserActivityRepository
{
  entity = UserActivity;

  async listUserActivities(userId: string, pagination: Pagination): Promise<ListUserActivitiesResult> {
    const results = this.filter((activity) => activity.userId === userId).map(
      (activity): PaginatedItem<ListUserActivitiesResult> => ({
        id: activity.id,
        type: activity.type,
        date: activity.date.toString(),
        payload: activity.payload,
      })
    );

    return this.paginate(results, pagination);
  }
}
