import type { Nick, User } from '@shakala/backend-domain';

import { UserRepository } from '../../interfaces';
import { InMemoryRepository } from '../../utils';

export class InMemoryUserRepository extends InMemoryRepository<User> implements UserRepository {
  protected entityName = 'user';

  async findByEmail(email: string): Promise<User | undefined> {
    return this.find((user) => user.email === email);
  }

  async findByNick(nick: Nick): Promise<User | undefined> {
    return this.find((user) => user.nick.equals(nick));
  }
}
