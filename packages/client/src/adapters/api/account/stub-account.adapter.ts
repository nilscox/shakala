import { stub } from '@shakala/shared';

import { AccountPort } from './account.port';

export class StubAccountAdapter implements AccountPort {
  getUserActivities = stub<AccountPort['getUserActivities']>();
  getNotificationsCount = stub<AccountPort['getNotificationsCount']>();
  getNotifications = stub<AccountPort['getNotifications']>();
}
