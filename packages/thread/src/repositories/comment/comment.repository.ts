import { Repository } from '@shakala/common';

import { Comment } from '../../entities/comment.entity';

// todo: rename to CommentSort
export enum Sort {
  dateAsc = 'date-asc',
  dateDesc = 'date-desc',
  relevance = 'relevance',
}

export interface CommentRepository extends Repository<Comment> {}
