import { ThreadDto } from '@shakala/shared';

export interface ThreadPort {
  getLastThreads(count: number): Promise<ThreadDto[]>;
}
