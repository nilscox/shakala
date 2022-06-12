import type { Thread } from 'backend-domain';

export interface ThreadRepository {
  findLasts(count: number): Promise<Thread[]>;
  findById(threadId: string): Promise<Thread | undefined>;
  save(thread: Thread): Promise<void>;
}
