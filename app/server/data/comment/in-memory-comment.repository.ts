import { inject } from 'inversify';

import { Sort } from '~/types';

import { InMemoryRepository } from '../in-memory.repository';

import { CommentEntity } from './comment.entity';
import { CommentRepository } from './comment.repository';

export class InMemoryCommentRepository
  extends InMemoryRepository<CommentEntity>
  implements CommentRepository
{
  constructor(@inject('comments') comments?: CommentEntity[]) {
    super(comments);
  }

  async findForThread(threadId: string, sortOrder?: Sort, search?: string): Promise<CommentEntity[]> {
    const filter = (comments: CommentEntity[]) => {
      if (!search) {
        return comments;
      }

      const replies = (commentId: string) => comments.filter(({ parentId }) => parentId === commentId);

      const match = ({ id, text }: CommentEntity) => {
        return text.includes(search) || replies(id).some(match);
      };

      return comments.filter(match);
    };

    const sort = (comments: CommentEntity[]) => {
      const createdAt = (comment: CommentEntity) => new Date(comment.createdAt).getTime();

      if (sortOrder === Sort.dateAsc) {
        return comments.sort((a, b) => createdAt(a) - createdAt(b));
      } else if (sortOrder === Sort.dateDesc) {
        return comments.sort((a, b) => createdAt(b) - createdAt(a));
      } else {
        return comments.sort(({ upvotes: a }, { upvotes: b }) => b - a);
      }
    };

    const comments = this.filter((comment) => comment.threadId === threadId && comment.parentId === null);

    return sort(filter(comments));
  }

  async findReplies(parentId: string): Promise<CommentEntity[]> {
    return this.filter((comment) => comment.parentId === parentId);
  }
}
