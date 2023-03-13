import { Pagination } from '@shakala/common';

import { UserActivity } from '../../entities/user-activity.entity';
import { ListUserActivitiesResult } from '../../queries/list-user-activities';

export interface UserActivityRepository {
  listUserActivities(userId: string, pagination: Pagination): Promise<ListUserActivitiesResult>;

  save(userActivity: UserActivity): Promise<void>;
}
