import type { UserActivity } from 'backend-domain';

import { UserActivityRepository } from '../../interfaces';
import { InMemoryRepository } from '../../utils';
import { Paginated, Pagination } from '../../utils/pagination';

export class InMemoryUserActivityRepository
  extends InMemoryRepository<UserActivity>
  implements UserActivityRepository
{
  protected entityName = 'userActivity';

  async findForUser(userId: string, pagination: Pagination): Promise<Paginated<UserActivity>> {
    return this.paginate(
      this.filter((item) => item.userId === userId),
      pagination,
    );
  }
}
