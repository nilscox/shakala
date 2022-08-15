import { User } from 'backend-domain';

import { Query, QueryHandler } from '../cqs/query-handler';
import { UserRepository } from '../interfaces/repositories';

export class GetUserByEmailQuery implements Query {
  constructor(public readonly email: string) {}
}

export class GetUserByEmailHandler implements QueryHandler<GetUserByEmailQuery, User | undefined> {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(query: GetUserByEmailQuery): Promise<User | undefined> {
    return this.userRepository.findByEmail(query.email);
  }
}
