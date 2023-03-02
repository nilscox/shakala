import { FilesystemPort, TOKENS } from '@shakala/common';
import { injected } from 'brandi';

import { CommentSubscription } from '../../entities/comment-subscription.entity';

import { CommentSubscriptionRepository } from './comment-subscription.repository';
import { InMemoryCommentSubscriptionRepository } from './in-memory-comment-subscription.repository';

export class FilesystemCommentSubscriptionRepository
  extends InMemoryCommentSubscriptionRepository
  implements CommentSubscriptionRepository
{
  constructor(private readonly filesystem: FilesystemPort) {
    super();
  }

  override async save(comment: CommentSubscription): Promise<void> {
    await super.save(comment);
    await this.filesystem.writeJSONFile('comment-subscriptions.json', this.all());
  }
}

injected(FilesystemCommentSubscriptionRepository, TOKENS.filesystem);
