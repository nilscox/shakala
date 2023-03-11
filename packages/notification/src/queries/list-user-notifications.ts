import { queryCreator, QueryHandler, registerQuery } from '@shakala/common';
import { injected } from 'brandi';

import { NotificationPayloadMap, NotificationType } from '../entities/notification.entity';
import { NotificationRepository } from '../repositories/notification.repository';
import { NOTIFICATION_TOKENS } from '../tokens';

type ListUserNotificationsQuery = {
  userId: string;
};

export type ListUserNotificationsResult = Array<{
  id: string;
  type: NotificationType;
  created: string;
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
    return this.notificationRepository.getUserNotifications(query.userId);
  }
}

injected(ListUserNotificationsHandler, NOTIFICATION_TOKENS.repositories.notificationRepository);
registerQuery(listUserNotifications, NOTIFICATION_TOKENS.queries.listUserNotificationsHandler);