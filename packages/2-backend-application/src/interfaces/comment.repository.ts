import { Comment } from 'backend-domain';

export enum Sort {
  dateAsc = 'date-asc',
  dateDesc = 'date-desc',
  relevance = 'relevance',
}

export interface CommentRepository {
  findForThread(threadId: string, sort: Sort, search?: string): Promise<Comment[]>;
  findReplies(parentId: string): Promise<Comment[]>;
  findAllReplies(parentIds: string[]): Promise<Map<string, Comment[]>>;
  findById(commentId: string): Promise<Comment | undefined>;
  findByIdOrFail(commentId: string): Promise<Comment>;
  save(comment: Comment): Promise<void>;
}
