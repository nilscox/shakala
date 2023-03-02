import { FilesystemPort, TOKENS } from '@shakala/common';
import { injected } from 'brandi';

import { CommentReportRepository } from './comment-report.repository';
import { InMemoryCommentReportRepository } from './in-memory-comment-report.repository';

export class FilesystemCommentReportRepository
  extends InMemoryCommentReportRepository
  implements CommentReportRepository
{
  constructor(private readonly filesystem: FilesystemPort) {
    super();
  }

  override dump = () => this.filesystem.dumpRepository(this);
}

injected(FilesystemCommentReportRepository, TOKENS.filesystem);
