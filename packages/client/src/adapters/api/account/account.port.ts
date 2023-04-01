import { UserActivityDto } from '@shakala/shared';

import { Page } from '~/utils/page';

export interface AccountPort {
  getUserActivities(page?: number): Promise<Page<UserActivityDto>>;
}
