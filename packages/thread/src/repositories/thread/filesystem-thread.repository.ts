import { FilesystemPort, TOKENS } from '@shakala/common';
import { injected } from 'brandi';

import { Thread } from '../../entities/thread.entity';

import { InMemoryThreadRepository } from './in-memory-thread.repository';
import { ThreadRepository } from './thread.repository';

export class FilesystemThreadRepository extends InMemoryThreadRepository implements ThreadRepository {
  entity = Thread;

  constructor(private readonly filesystem: FilesystemPort) {
    super();
  }

  dump = () => this.filesystem.dumpRepository(this);
}

injected(FilesystemThreadRepository, TOKENS.filesystem);
