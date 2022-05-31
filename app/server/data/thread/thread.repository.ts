import { Thread } from '../../thread/thread.entity';

export const ThreadRepositoryToken = Symbol('ThreadRepositoryToken');

export interface ThreadRepository {
  findLasts(count: number): Promise<Thread[]>;
  findById(threadId: string): Promise<Thread | undefined>;
  save(thread: Thread): Promise<void>;
}
