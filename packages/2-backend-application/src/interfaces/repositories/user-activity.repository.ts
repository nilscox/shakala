import type { UserActivity } from 'backend-domain';

import { Paginated, Pagination } from '../../utils/pagination';
import { Repository } from '../repository';

export interface UserActivityRepository extends Repository<UserActivity> {
  findForUser(userId: string, pagination: Pagination): Promise<Paginated<UserActivity>>;
}
