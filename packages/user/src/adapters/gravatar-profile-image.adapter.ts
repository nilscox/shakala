import crypto from 'node:crypto';

import { User } from '../entities/user.entity';

import { ProfileImagePort } from './profile-image.port';

export class GravatarProfileImageAdapter implements ProfileImagePort {
  static gravatarBaseUrl = 'https://www.gravatar.com/avatar/';
  static params = new URLSearchParams({ default: 'mp' });

  async getProfileImageUrl(user: User): Promise<string> {
    return this.getGravatarUrl(user.email);
  }

  private getGravatarUrl(email: string) {
    return [
      GravatarProfileImageAdapter.gravatarBaseUrl,
      this.md5(email),
      `?${GravatarProfileImageAdapter.params.toString()}`,
    ].join('');
  }

  private md5(input: string) {
    return crypto.createHash('md5').update(input).digest('hex');
  }
}
