import { Comment } from '@shakala/backend-domain';
import { CommentDto } from '@shakala/shared';

import { Repository } from '../repository';

export enum Sort {
  dateAsc = 'date-asc',
  dateDesc = 'date-desc',
  relevance = 'relevance',
}

export interface CommentRepository extends Repository<Comment> {
  findThreadComments(threadId: string, sort: Sort, search?: string, userId?: string): Promise<CommentDto[]>;
}
