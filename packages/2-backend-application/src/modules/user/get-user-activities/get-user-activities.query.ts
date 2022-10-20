import { UserActivity } from 'backend-domain';

import { Query, QueryHandler } from '../../../cqs';
import { UserActivityRepository } from '../../../interfaces';
import { Paginated, Pagination, PaginationData } from '../../../utils/pagination';

export class GetUserActivitiesQuery implements Query {
  constructor(public readonly userId: string, public readonly pagination?: PaginationData) {}
}

export class GetUserActivitiesHandler
  implements QueryHandler<GetUserActivitiesQuery, Paginated<UserActivity>>
{
  constructor(private readonly userActivityRepository: UserActivityRepository) {}

  async handle(query: GetUserActivitiesQuery): Promise<Paginated<UserActivity>> {
    const { userId } = query;
    const pagination = Pagination.from(query.pagination);

    return this.userActivityRepository.findForUser(userId, pagination);
  }
}
