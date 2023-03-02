import { FilesystemPort } from '@shakala/common';

import { Thread } from '../../entities/thread.entity';

import { InMemoryThreadRepository } from './in-memory-thread.repository';
import { ThreadRepository } from './thread.repository';

export class FilesystemThreadRepository extends InMemoryThreadRepository implements ThreadRepository {
  entity = Thread;

  constructor(private readonly filesystem: FilesystemPort) {
    super();
  }

  override async save(thread: Thread): Promise<void> {
    await super.save(thread);
    await this.filesystem.writeJSONFile('threads.json', this.all());
  }
}
