import { Paginated, Pagination, queryCreator, QueryHandler, registerQuery } from '@shakala/common';
import { UserActivityType, UserActivityPayload } from '@shakala/shared';
import { injected } from 'brandi';

import { UserActivityRepository } from '../repositories/user-activity/user-activity.repository';
import { USER_TOKENS } from '../tokens';

export type ListUserActivitiesQuery = {
  userId: string;
  page: number;
  pageSize: number;
};

export type ListUserActivitiesResult = Paginated<{
  id: string;
  type: UserActivityType;
  date: string;
  payload: UserActivityPayload[UserActivityType];
}>;

export const listUserActivities = queryCreator<ListUserActivitiesQuery, ListUserActivitiesResult>(
  'listUserActivities'
);

export class ListUserActivitiesHandler
  implements QueryHandler<ListUserActivitiesQuery, ListUserActivitiesResult>
{
  constructor(private readonly userActivityRepository: UserActivityRepository) {}

  async handle(query: ListUserActivitiesQuery): Promise<ListUserActivitiesResult> {
    return this.userActivityRepository.listUserActivities(query.userId, Pagination.from(query));
  }
}

injected(ListUserActivitiesHandler, USER_TOKENS.repositories.userActivityRepository);
registerQuery(listUserActivities, USER_TOKENS.queries.listUserActivitiesHandler);
