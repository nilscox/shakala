import { User } from 'backend-domain';

import { Query, QueryHandler } from '../../cqs/query-handler';
import { UserRepository } from '../../interfaces/repositories';

export class GetUserByIdQuery implements Query {
  constructor(public readonly id: string) {}
}

export class GetUserByIdHandler implements QueryHandler<GetUserByIdQuery, User | undefined> {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(query: GetUserByIdQuery): Promise<User | undefined> {
    return this.userRepository.findById(query.id);
  }
}
