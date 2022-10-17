import type { UserActivity } from 'backend-domain';

import { Repository } from '../repository';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserActivityRepository extends Repository<UserActivity> {}
