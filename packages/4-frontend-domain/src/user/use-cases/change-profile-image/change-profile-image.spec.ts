import { mockResolve, mockReject } from 'shared';

import { createAuthUser, TestStore } from '../../../test';

import { changeProfileImage, InvalidImageFormat } from './change-profile-image';

describe('changeProfileImage', () => {
  const store = new TestStore();

  const mockFile = (): File => {
    return {
      name: '',
    } as File;
  };

  beforeEach(() => {
    store.user = createAuthUser();
  });

  it("change the user's profile image", async () => {
    const file = mockFile();

    store.userGateway.changeProfileImage = mockResolve('image.url');

    await store.dispatch(changeProfileImage(file));

    expect(store.userGateway.changeProfileImage).toHaveBeenCalledWith(file);
    expect(store.user).toHaveProperty('profileImage', 'image.url');
  });

  it('handles invalid image format errors', async () => {
    const file = mockFile();

    store.userGateway.changeProfileImage = mockReject(new InvalidImageFormat());

    await store.dispatch(changeProfileImage(file));

    expect(store.snackbarGateway.error).toHaveBeenCalledWith(
      "Le format d'image n'est pas reconnu. Les formats autorisés sont png, jpg et bmp.",
    );
  });
});
