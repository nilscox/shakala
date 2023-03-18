import { ThreadDto } from '@shakala/shared';

import { ApiAdapter } from '../api-adapter';

export interface ThreadPort extends ApiAdapter {
  getLastThreads(count: number): Promise<ThreadDto[]>;
}
