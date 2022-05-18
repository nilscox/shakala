import { inject, injectable } from 'inversify';

import { User } from '~/types';

export const UserRepositoryToken = Symbol('UserRepositoryToken');

export interface UserRepository {
  findById(userId: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  save(user: User): Promise<void>;
}

@injectable()
export class InMemoryUserRepository implements UserRepository {
  constructor(@inject('users') private readonly users: User[]) {}

  async findById(userId: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === userId);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
  }
}
