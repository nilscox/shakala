import { Comment } from 'backend-domain';

import { CommentRepository, Sort } from '../interfaces/comment.repository';

import { InMemoryRepository } from './in-memory-repository';

export class InMemoryCommentRepository extends InMemoryRepository<Comment> implements CommentRepository {
  async findForThread(threadId: string, sortOrder: Sort, search?: string): Promise<Comment[]> {
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

  async findAllReplies(parentIds: string[]): Promise<Map<string, Comment[]>> {
    return new Map(
      await Promise.all(
        parentIds.map(async (parentId) => [parentId, await this.findReplies(parentId)] as const),
      ),
    );
  }
}
