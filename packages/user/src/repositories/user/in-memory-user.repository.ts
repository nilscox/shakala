import { InMemoryRepository } from '@shakala/common';

import { User } from '../../entities/user.entity';
import { GetUserResult } from '../../queries/get-user';

import { UserRepository } from './user.repository';

export class InMemoryUserRepository extends InMemoryRepository<User> implements UserRepository {
  entity = User;

  constructor(items?: User[]) {
    super(items);
  }

  async listUsers(): Promise<{ id: string }[]> {
    return this.all().map((user) => ({ id: user.id }));
  }

  async getUser(where: Partial<{ id: string; email: string }>): Promise<GetUserResult> {
    const user = this.find((user) => {
      return where.id === user.id || where.email === user.email;
    });

    if (!user) {
      return;
    }

    return {
      id: user.id,
      email: user.email,
      emailValidated: user.emailValidationToken === undefined,
      profileImage: `/user/${user.id}/profile-image`,
      nick: user.nick.toString(),
      signupDate: user.signupDate.toString(),
    };
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.find((user) => user.email === email);
  }
}
