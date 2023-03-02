import { queryCreator, QueryHandler } from '@shakala/common';
import { injected } from 'brandi';

import { UserRepository } from '../repositories/user.repository';
import { USER_TOKENS } from '../tokens';

export type GetUserQuery = { id: string } | { email: string };

export type GetUserResult = {
  id: string;
  email: string;
};

const symbol = Symbol('GetUser');
export const getUser = queryCreator<GetUserQuery, GetUserResult>(symbol);

export class GetUserHandler implements QueryHandler<GetUserQuery, GetUserResult | undefined> {
  symbol = symbol;

  constructor(private readonly userRepository: UserRepository) {}

  async handle(query: GetUserQuery): Promise<GetUserResult | undefined> {
    return this.userRepository.getUser(query);
  }
}

injected(GetUserHandler, USER_TOKENS.userRepository);
