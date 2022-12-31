import { Notification } from '@shakala/backend-domain';

import { Paginated, Pagination } from '../../utils/pagination';
import { Repository } from '../repository';

export interface NotificationRepository extends Repository<Notification> {
  findForUser(userId: string, pagination: Pagination): Promise<Paginated<Notification>>;
  countUnseenForUser(userId: string): Promise<number>;
}
