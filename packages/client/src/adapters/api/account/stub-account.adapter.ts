import { stub } from '@shakala/shared';

import { AccountPort } from './account.port';

export class StubAccountAdapter implements AccountPort {
  getUserActivities = stub<AccountPort['getUserActivities']>();
}
