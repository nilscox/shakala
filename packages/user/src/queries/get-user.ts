import { queryCreator, QueryHandler, registerQuery } from '@shakala/common';
import { injected } from 'brandi';

import { UserRepository } from '../repositories/user.repository';
import { USER_TOKENS } from '../tokens';

export type GetUserQuery = { id: string } | { email: string };

export type GetUserResult = {
  id: string;
  email: string;
  nick: string;
  profileImage?: string;
};

export const getUser = queryCreator<GetUserQuery, GetUserResult | undefined>('getUser');

export class GetUserHandler implements QueryHandler<GetUserQuery, GetUserResult | undefined> {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(query: GetUserQuery): Promise<GetUserResult | undefined> {
    return this.userRepository.getUser(query);
  }
}

injected(GetUserHandler, USER_TOKENS.repositories.userRepository);
registerQuery(getUser, USER_TOKENS.queries.getUserHandler);
