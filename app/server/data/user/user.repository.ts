import { UserEntity } from './user.entity';

export const UserRepositoryToken = Symbol('UserRepositoryToken');

export interface UserRepository {
  findAll(): Promise<UserEntity[]>;
  findById(userId: string): Promise<UserEntity | undefined>;
  findByEmail(email: string): Promise<UserEntity | undefined>;
  save(user: UserEntity): Promise<void>;
}
