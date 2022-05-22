import { inject, injectable } from 'inversify';

import { Comment, Sort, Thread } from '~/types';

export const ThreadRepositoryToken = Symbol('ThreadRepositoryToken');

export interface ThreadRepository {
  findLasts(): Promise<Thread[]>;
  findById(threadId: string): Promise<Thread | undefined>;
  findComments(threadId: string, sort?: Sort, search?: string): Promise<Comment[] | undefined>;
  addComment(threadId: string, parentId: string | null, comment: Comment): Promise<void>;
}

@injectable()
export class InMemoryThreadRepository implements ThreadRepository {
  constructor(@inject('threads') private readonly threads: Thread[]) {}

  async findLasts(): Promise<Thread[]> {
    return this.threads;
  }

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

  async addComment(threadId: string, parentId: string | null, comment: Comment): Promise<void> {
    const thread = await this.findById(threadId);

    if (!thread) {
      throw new Error(`Cannot find thread with id "${threadId}"`);
    }

    if (parentId) {
      const parent = thread.comments.find((comment) => comment.id === parentId);

      if (!parent) {
        throw new Error(`Cannot find root comment with id "${parentId}" in thread with id "${threadId}"`);
      }

      parent.replies.push(comment);
    } else {
      thread.comments.push(comment);
    }
  }
}
