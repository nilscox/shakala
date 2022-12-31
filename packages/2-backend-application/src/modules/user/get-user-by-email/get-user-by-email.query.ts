import { User } from '@shakala/backend-domain';

import { Query, QueryHandler } from '../../../cqs';
import { UserRepository } from '../../../interfaces';

export class GetUserByEmailQuery implements Query {
  constructor(public readonly email: string) {}
}

export class GetUserByEmailHandler implements QueryHandler<GetUserByEmailQuery, User | undefined> {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(query: GetUserByEmailQuery): Promise<User | undefined> {
    return this.userRepository.findByEmail(query.email);
  }
}
