import { FilesystemPort, TOKENS } from '@shakala/common';
import { injected } from 'brandi';

import { CommentRepository } from './comment.repository';
import { InMemoryCommentRepository } from './in-memory-comment.repository';

export class FilesystemCommentRepository extends InMemoryCommentRepository implements CommentRepository {
  constructor(private readonly filesystem: FilesystemPort) {
    super();
  }

  override dump = () => this.filesystem.dumpRepository(this);
}

injected(FilesystemCommentRepository, TOKENS.filesystem);
