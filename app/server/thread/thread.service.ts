import { inject, injectable } from 'inversify';

import { ThreadRepository, ThreadRepositoryToken } from '~/server/repositories/thread.repository.server';

import { Comment, User } from '../../types';

@injectable()
export class ThreadService {
  constructor(
    @inject(ThreadRepositoryToken)
    private readonly threadRepository: ThreadRepository,
  ) {}

  async findLastThreads() {
    return this.threadRepository.findLasts();
  }

  async createComment(
    author: User,
    threadId: string,
    parentId: string | null,
    message: string,
  ): Promise<Comment> {
    const comment: Comment = {
      id: Math.random().toString(36).slice(-6),
      author,
      date: new Date().toISOString(),
      text: message,
      upvotes: 0,
      downvotes: 0,
      repliesCount: 0,
      replies: [],
    };

    await this.threadRepository.addComment(threadId, parentId ?? null, comment);

    return comment;
  }

  async updateComment(author: User, commentId: string, message: string): Promise<void> {
    const comment = await this.threadRepository.findCommentById(commentId);

    if (!comment) {
      throw new Error(`Cannot find comment with id ${commentId}`);
    }

    await this.threadRepository.updateComment({ ...comment, text: message });
  }
}
