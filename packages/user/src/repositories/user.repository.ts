import { User } from '../entities/user.entity';

export interface UserRepository {
  findById(id: string): Promise<User | undefined>;
  findByIdOrFail(id: string): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
  save(user: User): Promise<void>;
}
