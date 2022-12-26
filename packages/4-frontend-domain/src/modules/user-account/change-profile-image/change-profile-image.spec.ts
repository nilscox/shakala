import { InvalidImageFormat } from 'shared';

import { createTestStore, TestStore } from '../../../test-store';
import { userProfileSelectors } from '../user-profile.selectors';
import { createAuthUser } from '../user-profile.types';

import { changeProfileImage } from './change-profile-image.';

const mockFile = (): File => {
  return { name: '' } as File;
};

describe('changeProfileImage', () => {
  let store: TestStore;

  beforeEach(() => {
    store = createTestStore();
    store.user = createAuthUser();
  });

  it("changes the user's profile image", async () => {
    const file = mockFile();

    store.userProfileGateway.changeProfileImage.resolve('image.url');

    await store.dispatch(changeProfileImage(file));

    expect(store.select(userProfileSelectors.authenticatedUser)).toHaveProperty('profileImage', 'image.url');
  });

  it('handles invalid image format errors', async () => {
    store.userProfileGateway.changeProfileImage.reject(
      new InvalidImageFormat({ type: 'pdf', allowedTypes: ['png', 'jpg', 'bmp'] }),
    );

    await store.dispatch(changeProfileImage(mockFile()));

    expect(store.snackbarGateway).toHaveSnack(
      'error',
      "Le format d'image (pdf) n'est pas reconnu. Les formats autorisés sont png, jpg et bmp.",
    );
  });

  it('throws when the call to the gateway throws', async () => {
    const error = new Error('nope');

    store.userProfileGateway.changeProfileImage.reject(error);

    await expect.rejects(store.dispatch(changeProfileImage(mockFile()))).with(error);
  });
});
