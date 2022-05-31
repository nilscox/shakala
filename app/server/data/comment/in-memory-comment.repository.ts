import { inject } from 'inversify';

import { Sort } from '~/types';

import { Comment } from '../../thread/comment.entity';
import { InMemoryRepository } from '../in-memory.repository';

import { CommentRepository } from './comment.repository';

export class InMemoryCommentRepository extends InMemoryRepository<Comment> implements CommentRepository {
  constructor(@inject('comments') comments?: Comment[]) {
    super(comments);
  }

  async findForThread(threadId: string, sortOrder?: Sort, search?: string): Promise<Comment[]> {
    const filter = (comments: Comment[]) => {
      if (!search) {
        return comments;
      }

      const replies = (commentId: string) => comments.filter(({ parentId }) => parentId === commentId);

      const match = ({ id, text }: Comment) => {
        return text.match(search) || replies(id).some(match);
      };

      return comments.filter(match);
    };

    const sort = (comments: Comment[]) => {
      const epoch = (comment: Comment) => comment.creationDate.epoch;

      if (sortOrder === Sort.dateAsc) {
        return comments.sort((a, b) => epoch(a) - epoch(b));
      } else if (sortOrder === Sort.dateDesc) {
        return comments.sort((a, b) => epoch(b) - epoch(a));
      } else {
        return comments.sort(({ upvotes: a }, { upvotes: b }) => b - a);
      }
    };

    const comments = this.filter((comment) => comment.threadId === threadId && comment.parentId === null);

    return sort(filter(comments));
  }

  async findReplies(parentId: string): Promise<Comment[]> {
    return this.filter((comment) => comment.parentId === parentId);
  }
}
