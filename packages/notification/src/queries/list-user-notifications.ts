import { Paginated, Pagination, queryCreator, QueryHandler, registerQuery } from '@shakala/common';
import { NotificationPayloadMap, NotificationType } from '@shakala/shared';
import { injected } from 'brandi';

import { NotificationRepository } from '../repositories/notification.repository';
import { NOTIFICATION_TOKENS } from '../tokens';

type ListUserNotificationsQuery = {
  userId: string;
  page: number;
  pageSize: number;
};

export type ListUserNotificationsResult = Paginated<{
  id: string;
  type: NotificationType;
  date: string;
  seen: false | string;
  payload: NotificationPayloadMap[NotificationType];
}>;

export const listUserNotifications = queryCreator<ListUserNotificationsQuery, ListUserNotificationsResult>(
  'listUserNotifications'
);

export class ListUserNotificationsHandler
  implements QueryHandler<ListUserNotificationsQuery, ListUserNotificationsResult>
{
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async handle(query: ListUserNotificationsQuery): Promise<ListUserNotificationsResult> {
    return this.notificationRepository.getUserNotifications(query.userId, Pagination.from(query));
  }
}

injected(ListUserNotificationsHandler, NOTIFICATION_TOKENS.repositories.notificationRepository);
registerQuery(listUserNotifications, NOTIFICATION_TOKENS.queries.listUserNotificationsHandler);
