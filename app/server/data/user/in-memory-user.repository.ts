import { inject, injectable } from 'inversify';

import { InMemoryRepository } from '../in-memory.repository';

import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@injectable()
export class InMemoryUserRepository extends InMemoryRepository<UserEntity> implements UserRepository {
  constructor(@inject('users') users?: UserEntity[]) {
    super(users);
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return this.find((user) => user.email === email);
  }
}
