import { ProfileImage, ProfileImageData, ProfileImageStoreService } from 'backend-domain';

import { Query, QueryHandler } from '../../cqs/query-handler';

export class GetProfileImageQuery implements Query {
  constructor(public readonly imageName: string) {}
}

export class GetProfileImageHandler
  implements QueryHandler<GetProfileImageQuery, ProfileImageData | undefined>
{
  constructor(private readonly profileImageStoreService: ProfileImageStoreService) {}

  async handle(query: GetProfileImageQuery): Promise<ProfileImageData | undefined> {
    const { imageName } = query;

    return this.profileImageStoreService.readProfileImage(new ProfileImage(imageName));
  }
}
