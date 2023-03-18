import { FilesystemPort, TOKENS } from '@shakala/common';
import { injected } from 'brandi';

import { ProfileImagePort } from '../../adapters/profile-image.port';
import { USER_TOKENS } from '../../tokens';

import { InMemoryUserRepository } from './in-memory-user.repository';
import { UserRepository } from './user.repository';

export class FilesystemUserRepository extends InMemoryUserRepository implements UserRepository {
  constructor(private readonly filesystem: FilesystemPort, profileImageAdapter: ProfileImagePort) {
    super([], profileImageAdapter);
  }

  override dump = () => this.filesystem.dumpRepository(this);
}

injected(FilesystemUserRepository, TOKENS.filesystem, USER_TOKENS.adapters.profileImage);
