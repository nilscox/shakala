import { User } from '../entities/user.entity';
import { GetUserResult } from '../queries/get-user.query';

export interface UserRepository {
  getUser(where: Partial<{ id: string; email: string }>): Promise<GetUserResult | undefined>;

  findById(id: string): Promise<User | undefined>;
  findByIdOrFail(id: string): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
  save(user: User): Promise<void>;
}
