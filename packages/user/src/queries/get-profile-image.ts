import { EntityNotFoundError, queryCreator, QueryHandler, registerQuery } from '@shakala/common';
import { injected } from 'brandi';

import { ProfileImagePort } from '../adapters/profile-image/profile-image.port';
import { UserRepository } from '../repositories/user/user.repository';
import { USER_TOKENS } from '../tokens';

export type GetProfileImageQuery = {
  userId: string;
};

export type GetProfileImageResult = string;

export const getProfileImage = queryCreator<GetProfileImageQuery, GetProfileImageResult>('getProfileImage');

export class GetProfileImageHandler implements QueryHandler<GetProfileImageQuery, GetProfileImageResult> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly profileImageAdapter: ProfileImagePort
  ) {}

  async handle(query: GetProfileImageQuery): Promise<GetProfileImageResult> {
    const user = await this.userRepository.getUser({ id: query.userId });

    if (!user) {
      throw new EntityNotFoundError('User', { id: query.userId });
    }

    return this.profileImageAdapter.getProfileImageUrl(user.email);
  }
}

injected(GetProfileImageHandler, USER_TOKENS.repositories.userRepository, USER_TOKENS.adapters.profileImage);
registerQuery(getProfileImage, USER_TOKENS.queries.getProfileImageHandler);
