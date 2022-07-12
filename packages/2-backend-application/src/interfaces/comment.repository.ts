import { Comment } from 'backend-domain';

export enum Sort {
  dateAsc = 'date-asc',
  dateDesc = 'date-desc',
  relevance = 'relevance',
}

export interface CommentRepository {
  findRoots(threadId: string, sort: Sort, search?: string): Promise<Comment[]>;
  findReplies(parentIds: string[]): Promise<Map<string, Comment[]>>;
  findById(commentId: string): Promise<Comment | undefined>;
  findByIdOrFail(commentId: string): Promise<Comment>;
  save(comment: Comment): Promise<void>;
}
