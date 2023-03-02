import { FilesystemPort, TOKENS } from '@shakala/common';
import { injected } from 'brandi';

import { CommentReport } from '../../entities/comment-report.entity';

import { CommentReportRepository } from './comment-report.repository';
import { InMemoryCommentReportRepository } from './in-memory-comment-report.repository';

export class FilesystemCommentReportRepository
  extends InMemoryCommentReportRepository
  implements CommentReportRepository
{
  constructor(private readonly filesystem: FilesystemPort) {
    super();
  }

  override async save(comment: CommentReport): Promise<void> {
    await super.save(comment);
    await this.filesystem.writeJSONFile('comment-reports.json', this.all());
  }
}

injected(FilesystemCommentReportRepository, TOKENS.filesystem);
