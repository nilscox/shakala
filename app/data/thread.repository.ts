import { Service, Token } from 'typedi';

import { Thread } from '~/types';

export const ThreadRepositoryToken = new Token<ThreadRepository>('ThreadRepositoryToken');

export interface ThreadRepository {
  findById(threadId: string): Promise<Thread | undefined>;
}

@Service()
export class InMemoryThreadRepository implements ThreadRepository {
  constructor(private readonly threads: Thread[]) {}

  async findById(threadId: string): Promise<Thread | undefined> {
    return this.threads.find((thread) => thread.id === threadId);
  }
}
