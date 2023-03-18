import { User } from '../entities/user.entity';

import { ProfileImagePort } from './profile-image.port';

export class StubProfileImageAdapter implements ProfileImagePort {
  static gravatarBaseUrl = 'https://www.gravatar.com/avatar/';

  async getProfileImageUrl(user: User): Promise<string> {
    return `${user.id}.png`;
  }
}
