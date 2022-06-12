import type { Nick, User } from 'backend-domain';

export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(userId: string): Promise<User | undefined>;
  findByIdOrFail(userId: string): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
  findByNick(nick: Nick): Promise<User | undefined>;
  save(user: User): Promise<void>;
}
