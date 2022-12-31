import { User } from '@shakala/backend-domain';

import { Query, QueryHandler } from '../../../cqs';
import { UserRepository } from '../../../interfaces';

export class GetUserByIdQuery implements Query {
  constructor(public readonly id: string) {}
}

export class GetUserByIdHandler implements QueryHandler<GetUserByIdQuery, User | undefined> {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(query: GetUserByIdQuery): Promise<User | undefined> {
    return this.userRepository.findById(query.id);
  }
}
