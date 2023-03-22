import expect from '@nilscox/expect';
import { describe, it } from 'vitest';

import { GravatarProfileImageAdapter } from './gravatar-profile-image.adapter';

describe('GravatarProfileImageAdapter', () => {
  it("return a user's gravatar profile image url", async () => {
    const adapter = new GravatarProfileImageAdapter();

    await expect(adapter.getProfileImageUrl('email')).toResolve(
      'https://www.gravatar.com/avatar/0c83f57c786a0b4a39efab23731c7ebc?default=mp'
    );
  });
});
