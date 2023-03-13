import { queryCreator, QueryHandler, registerQuery } from '@shakala/common';
import { injected } from 'brandi';

import { NotificationRepository } from '../repositories/notification.repository';
import { NOTIFICATION_TOKENS } from '../tokens';

type GetNotificationsCountQuery = {
  userId: string;
  unseen: boolean;
};

export type GetNotificationsCountResult = number;

export const getNotificationsCount = queryCreator<GetNotificationsCountQuery, GetNotificationsCountResult>(
  'getNotificationsCount'
);

export class GetNotificationsCountHandler
  implements QueryHandler<GetNotificationsCountQuery, GetNotificationsCountResult>
{
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async handle(query: GetNotificationsCountQuery): Promise<GetNotificationsCountResult> {
    return this.notificationRepository.getNotificationsCount(query.userId, query.unseen);
  }
}

injected(GetNotificationsCountHandler, NOTIFICATION_TOKENS.repositories.notificationRepository);
registerQuery(getNotificationsCount, NOTIFICATION_TOKENS.queries.getNotificationsCountHandler);
