import { inject, injectable } from 'inversify';

import { Comment, Sort, Thread } from '~/types';

export const ThreadRepositoryToken = Symbol('ThreadRepositoryToken');

export interface ThreadRepository {
  findById(threadId: string): Promise<Thread | undefined>;
  findComments(threadId: string, sort?: Sort, search?: string): Promise<Comment[] | undefined>;
}

@injectable()
export class InMemoryThreadRepository implements ThreadRepository {
  constructor(@inject('threads') private readonly threads: Thread[]) {}

  async findById(threadId: string): Promise<Thread | undefined> {
    return this.threads.find((thread) => thread.id === threadId);
  }

  async findComments(threadId: string, sort?: Sort, search?: string): Promise<Comment[] | undefined> {
    const thread = await this.findById(threadId);

    if (!thread) {
      return;
    }

    let comments = thread.comments;

    if (search) {
      comments = comments.filter((comment) => comment.text.includes(search));
    }

    if (sort === Sort.dateAsc) {
      comments.sort(({ date: a }, { date: b }) => new Date(a).getTime() - new Date(b).getTime());
    } else if (sort === Sort.dateDesc) {
      comments.sort(({ date: a }, { date: b }) => new Date(b).getTime() - new Date(a).getTime());
    } else {
      comments.sort(({ upvotes: a }, { upvotes: b }) => b - a);
    }

    return comments;
  }
}
