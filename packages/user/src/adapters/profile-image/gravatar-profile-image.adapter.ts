import crypto from 'node:crypto';

import { ProfileImagePort } from './profile-image.port';

export class GravatarProfileImageAdapter implements ProfileImagePort {
  static gravatarBaseUrl = 'https://www.gravatar.com/avatar/';
  static params = new URLSearchParams({ default: 'mp' });

  async getProfileImageUrl(email: string): Promise<string> {
    return this.getGravatarUrl(email);
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
