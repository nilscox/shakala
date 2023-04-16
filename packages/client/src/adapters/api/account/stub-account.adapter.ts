import { stub } from '@shakala/shared';

import { AccountPort } from './account.port';

export class StubAccountAdapter implements AccountPort {
  validateEmail = stub<AccountPort['validateEmail']>();
  getUserActivities = stub<AccountPort['getUserActivities']>();
  getNotificationsCount = stub<AccountPort['getNotificationsCount']>();
  getNotifications = stub<AccountPort['getNotifications']>();
  markNotificationAsSeen = stub<AccountPort['markNotificationAsSeen']>();
  changeNick = stub<AccountPort['changeNick']>();
}
