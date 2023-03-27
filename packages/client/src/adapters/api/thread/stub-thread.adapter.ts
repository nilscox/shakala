import { stub } from '@shakala/shared';

import { ThreadPort } from './thread.port';

export class StubThreadAdapter implements ThreadPort {
  getLastThreads = stub<ThreadPort['getLastThreads']>();
  getThread = stub<ThreadPort['getThread']>();
  createThread = stub<ThreadPort['createThread']>();
}
