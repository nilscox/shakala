import { Comment } from '@shakala/backend-domain';
import { CommentDto } from '@shakala/shared';

import { CommentRepository } from '../../interfaces';
import { InMemoryRepository } from '../../utils';

export class InMemoryCommentRepository extends InMemoryRepository<Comment> implements CommentRepository {
  protected entityName = 'comment';

  constructor(items?: Comment[]) {
    super(items);
  }

  async findThreadComments(): Promise<CommentDto[]> {
    return [];
  }
}
