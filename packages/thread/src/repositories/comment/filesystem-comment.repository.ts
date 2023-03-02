import { FilesystemPort, TOKENS } from '@shakala/common';
import { injected } from 'brandi';

import { Comment } from '../../entities/comment.entity';

import { CommentRepository } from './comment.repository';
import { InMemoryCommentRepository } from './in-memory-comment.repository';

export class FilesystemCommentRepository extends InMemoryCommentRepository implements CommentRepository {
  constructor(private readonly filesystem: FilesystemPort) {
    super();
  }

  override async save(comment: Comment): Promise<void> {
    await super.save(comment);
    await this.filesystem.writeJSONFile('comments.json', this.all());
  }
}

injected(FilesystemCommentRepository, TOKENS.filesystem);
