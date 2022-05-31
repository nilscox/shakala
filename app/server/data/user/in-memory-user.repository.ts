import { inject, injectable } from 'inversify';

import { User } from '../../user/user.entity';
import { InMemoryRepository } from '../in-memory.repository';

import { UserRepository } from './user.repository';

@injectable()
export class InMemoryUserRepository extends InMemoryRepository<User> implements UserRepository {
  constructor(@inject('users') users?: User[]) {
    super(users);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.find((user) => user.email === email);
  }
}
