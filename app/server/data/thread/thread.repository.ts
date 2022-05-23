import { ThreadEntity } from './thread.entity';

export const ThreadRepositoryToken = Symbol('ThreadRepositoryToken');

export interface ThreadRepository {
  findLasts(count: number): Promise<ThreadEntity[]>;
  findById(threadId: string): Promise<ThreadEntity | undefined>;
  save(thread: ThreadEntity): Promise<void>;
}
