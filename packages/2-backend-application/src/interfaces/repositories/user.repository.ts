import type { Nick, User } from 'backend-domain';

import { Repository } from '../repository';

export interface UserRepository extends Repository<User> {
  findByEmail(email: string): Promise<User | undefined>;
  findByNick(nick: Nick): Promise<User | undefined>;
}
