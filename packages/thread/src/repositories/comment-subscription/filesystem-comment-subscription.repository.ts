import { FilesystemPort, TOKENS } from '@shakala/common';
import { injected } from 'brandi';

import { CommentSubscriptionRepository } from './comment-subscription.repository';
import { InMemoryCommentSubscriptionRepository } from './in-memory-comment-subscription.repository';

export class FilesystemCommentSubscriptionRepository
  extends InMemoryCommentSubscriptionRepository
  implements CommentSubscriptionRepository
{
  constructor(private readonly filesystem: FilesystemPort) {
    super();
  }

  override dump = () => this.filesystem.dumpRepository(this);
}

injected(FilesystemCommentSubscriptionRepository, TOKENS.filesystem);
