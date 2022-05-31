import { User } from '../../user/user.entity';

export const UserRepositoryToken = Symbol('UserRepositoryToken');

export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(userId: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  save(user: User): Promise<void>;
}
