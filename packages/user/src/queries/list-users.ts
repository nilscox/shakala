import { queryCreator, QueryHandler, registerQuery } from '@shakala/common';
import { injected } from 'brandi';

import { UserRepository } from '../repositories/user/user.repository';
import { USER_TOKENS } from '../tokens';

export type ListUsersQuery = {
  //
};

export type ListUsersResult = Array<{
  id: string;
}>;

export const listUsers = queryCreator<ListUsersQuery, ListUsersResult>('listUsers');

export class ListUsersHandler implements QueryHandler<ListUsersQuery, ListUsersResult> {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(): Promise<ListUsersResult> {
    return this.userRepository.listUsers();
  }
}

injected(ListUsersHandler, USER_TOKENS.repositories.userRepository);
registerQuery(listUsers, USER_TOKENS.queries.listUsersHandler);
