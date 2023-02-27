import { InMemoryRepository } from '@shakala/common';

import { User } from '../entities/user.entity';

import { UserRepository } from './user.repository';

export class InMemoryUserRepository extends InMemoryRepository<User> implements UserRepository {
  entity = User;

  async findByEmail(email: string): Promise<User | undefined> {
    return this.find((user) => user.email === email);
  }
}
