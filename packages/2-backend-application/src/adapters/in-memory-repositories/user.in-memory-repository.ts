import type { Nick, User } from 'backend-domain';

import { UserRepository } from '../../interfaces';
import { InMemoryRepository } from '../../utils';

export class InMemoryUserRepository extends InMemoryRepository<User> implements UserRepository {
  async findByEmail(email: string): Promise<User | undefined> {
    return this.find((user) => user.email === email);
  }

  async findByNick(nick: Nick): Promise<User | undefined> {
    return this.find((user) => user.nick.equals(nick));
  }
}
