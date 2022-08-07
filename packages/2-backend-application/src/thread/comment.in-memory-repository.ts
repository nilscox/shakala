import { Comment } from 'backend-domain';
import { getIds } from 'shared';

import { CommentRepository, Sort } from '../interfaces/comment.repository';
import { ReactionRepository } from '../interfaces/reaction.repository';
import { InMemoryRepository } from '../utils/in-memory-repository';

export class InMemoryCommentRepository extends InMemoryRepository<Comment> implements CommentRepository {
  constructor(private readonly reactionRepository: ReactionRepository, items?: Comment[]) {
    super(items);
  }

  async findRoots(threadId: string, sortOrder: Sort, search?: string): Promise<Comment[]> {
    const filter = (comments: Comment[]) => {
      if (!search) {
        return comments;
      }

      const replies = (commentId: string) => comments.filter(({ parentId }) => parentId === commentId);

      const match = ({ id, message }: Comment) => {
        return message.text.match(search) || replies(id).some(match);
      };

      return comments.filter(match);
    };

    const sort = (comments: Comment[]) => {
      const epoch = (comment: Comment) => comment.creationDate.epoch;
      const upvotes = (comment: Comment) => reactionsCounts.get(comment.id)?.upvote ?? 0;

      if (sortOrder === Sort.dateAsc) {
        return comments.sort((a, b) => epoch(a) - epoch(b));
      } else if (sortOrder === Sort.dateDesc) {
        return comments.sort((a, b) => epoch(b) - epoch(a));
      } else {
        return comments.sort((a, b) => upvotes(b) - upvotes(a));
      }
    };

    const comments = this.filter((comment) => comment.threadId === threadId && comment.parentId === null);
    const reactionsCounts = await this.reactionRepository.countReactions(getIds(comments));

    return sort(filter(comments));
  }

  async findReplies(parentIds: string[]): Promise<Map<string, Comment[]>> {
    return new Map(
      parentIds.map((parentId) => [parentId, this.filter((comment) => comment.parentId === parentId)]),
    );
  }
}
