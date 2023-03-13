import { queryCreator, QueryHandler, registerQuery } from '@shakala/common';
import { Maybe } from '@shakala/shared';
import { injected } from 'brandi';

import { UserRepository } from '../repositories/user/user.repository';
import { USER_TOKENS } from '../tokens';

export type GetUserQuery = { id: string } | { email: string };

export type GetUserResult = Maybe<{
  id: string;
  email: string;
  emailValidated: boolean;
  nick: string;
  profileImage?: string;
  signupDate: string;
}>;

export const getUser = queryCreator<GetUserQuery, GetUserResult>('getUser');

export class GetUserHandler implements QueryHandler<GetUserQuery, GetUserResult> {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(query: GetUserQuery): Promise<GetUserResult> {
    return this.userRepository.getUser(query);
  }
}

injected(GetUserHandler, USER_TOKENS.repositories.userRepository);
registerQuery(getUser, USER_TOKENS.queries.getUserHandler);
