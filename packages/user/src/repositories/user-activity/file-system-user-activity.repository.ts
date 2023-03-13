import { FilesystemPort, TOKENS } from '@shakala/common';
import { injected } from 'brandi';

import { InMemoryUserActivityRepository } from './in-memory-user-activity.repository';
import { UserActivityRepository } from './user-activity.repository';

export class FilesystemUserActivityRepository
  extends InMemoryUserActivityRepository
  implements UserActivityRepository
{
  constructor(private readonly filesystem: FilesystemPort) {
    super();
  }

  override dump = () => this.filesystem.dumpRepository(this);
}

injected(FilesystemUserActivityRepository, TOKENS.filesystem);
