import { Comment } from 'backend-domain';

import { Repository } from './repository';

export enum Sort {
  dateAsc = 'date-asc',
  dateDesc = 'date-desc',
  relevance = 'relevance',
}

export interface CommentRepository extends Repository<Comment> {
  findRoots(threadId: string, sort: Sort, search?: string): Promise<Comment[]>;
  findReplies(parentIds: string[]): Promise<Map<string, Comment[]>>;
}
