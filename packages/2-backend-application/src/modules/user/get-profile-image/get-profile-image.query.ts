import { ProfileImage, ProfileImageData, ProfileImageStorePort } from 'backend-domain';

import { Query, QueryHandler } from '../../../cqs';

export class GetProfileImageQuery implements Query {
  constructor(public readonly imageName: string) {}
}

export class GetProfileImageHandler
  implements QueryHandler<GetProfileImageQuery, ProfileImageData | undefined>
{
  constructor(private readonly profileImageStore: ProfileImageStorePort) {}

  async handle(query: GetProfileImageQuery): Promise<ProfileImageData | undefined> {
    const { imageName } = query;

    return this.profileImageStore.readProfileImage(new ProfileImage(imageName));
  }
}
