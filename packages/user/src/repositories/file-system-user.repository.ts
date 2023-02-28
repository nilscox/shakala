import { FilesystemPort, TOKENS } from '@shakala/common';
import { injected } from 'brandi';

import { User } from '../entities/user.entity';

import { InMemoryUserRepository } from './in-memory-user.repository';
import { UserRepository } from './user.repository';

export class FilesystemUserRepository extends InMemoryUserRepository implements UserRepository {
  constructor(private readonly filesystem: FilesystemPort) {
    super();
  }

  override async save(user: User): Promise<void> {
    await super.save(user);
    await this.filesystem.writeJSONFile('users.json', this.all());
  }
}

injected(FilesystemUserRepository, TOKENS.filesystem);
