import { NotificationGateway } from '../gateways/notification-gateway';
import { createStubFunction } from '../utils/create-stub-function';

export class StubNotificationGateway implements NotificationGateway {
  fetchNotifications = createStubFunction<NotificationGateway['fetchNotifications']>();
  fetchUnseenNotificationsCount = createStubFunction<NotificationGateway['fetchUnseenNotificationsCount']>();
  markNotificationAsSeen = createStubFunction<NotificationGateway['markNotificationAsSeen']>();
}
