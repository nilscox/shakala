import { ProfileImagePort } from './profile-image.port';

export class StubProfileImageAdapter implements ProfileImagePort {
  static gravatarBaseUrl = 'https://www.gravatar.com/avatar/';

  async getProfileImageUrl(email: string): Promise<string> {
    return `${email}.png`;
  }
}
