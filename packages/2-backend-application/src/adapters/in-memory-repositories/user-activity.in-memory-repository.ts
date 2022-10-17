import type { UserActivity } from 'backend-domain';

import { UserActivityRepository } from '../../interfaces';
import { InMemoryRepository } from '../../utils';

export class InMemoryUserActivityRepository
  extends InMemoryRepository<UserActivity>
  implements UserActivityRepository {}
