import { FilesystemPort, TOKENS } from '@shakala/common';
import { injected } from 'brandi';

import { InMemoryUserRepository } from './in-memory-user.repository';
import { UserRepository } from './user.repository';

export class FilesystemUserRepository extends InMemoryUserRepository implements UserRepository {
  constructor(private readonly filesystem: FilesystemPort) {
    super([]);
  }

  override dump = () => this.filesystem.dumpRepository(this);
}

injected(FilesystemUserRepository, TOKENS.filesystem);
