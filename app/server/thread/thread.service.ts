import { inject, injectable } from 'inversify';

import { ThreadRepository, ThreadRepositoryToken } from '../data/thread/thread.repository';

@injectable()
export class ThreadService {
  constructor(
    @inject(ThreadRepositoryToken)
    private readonly threadRepository: ThreadRepository,
  ) {}

  findThreadById = this.threadRepository.findById.bind(this.threadRepository);

  async findLastThreads(count: number) {
    return this.threadRepository.findLasts(count);
  }
}
