import { FilesystemPort, TOKENS } from '@shakala/common';
import { injected } from 'brandi';

import { InMemoryNotificationRepository } from './in-memory-notification.repository';
import { NotificationRepository } from './notification.repository';

export class FilesystemNotificationRepository
  extends InMemoryNotificationRepository
  implements NotificationRepository
{
  constructor(private readonly filesystem: FilesystemPort) {
    super();
  }

  override dump = () => this.filesystem.dumpRepository(this);
}

injected(FilesystemNotificationRepository, TOKENS.filesystem);
