import { queryCreator, QueryHandler } from '@shakala/common';

import { UserRepository } from '../repositories/user.repository';

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
