import { InMemoryRepository } from '@shakala/common';

import { User } from '../entities/user.entity';
import { GetUserResult } from '../queries/get-user.query';

import { UserRepository } from './user.repository';

export class InMemoryUserRepository extends InMemoryRepository<User> implements UserRepository {
  entity = User;

  async getUser(where: Partial<{ id: string; email: string }>): Promise<GetUserResult | undefined> {
    const user = this.find((user) => {
      return where.id === user.id || where.email === user.email;
    });

    if (!user) {
      return;
    }

    return {
      id: user.id,
      email: user.email,
    };
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.find((user) => user.email === email);
  }
}
