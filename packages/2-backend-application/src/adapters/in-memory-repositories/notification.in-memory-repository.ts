import type { Notification } from 'backend-domain';

import { NotificationRepository } from '../../interfaces';
import { InMemoryRepository } from '../../utils';
import { Paginated, Pagination } from '../../utils/pagination';

export class InMemoryNotificationRepository
  extends InMemoryRepository<Notification>
  implements NotificationRepository
{
  protected entityName = 'notification';

  async findForUser(userId: string, pagination: Pagination): Promise<Paginated<Notification>> {
    return this.paginate(
      this.filter((item) => item.userId === userId),
      pagination,
    );
  }

  async countUnseenForUser(userId: string): Promise<number> {
    return this.filter((item) => item.userId === userId && item.seenDate === undefined).length;
  }
}
