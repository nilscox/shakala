import {
  factories,
  ProfileImageData,
  ProfileImageType,
  StubGeneratorAdapter,
  StubProfileImageStoreAdapter,
  User,
} from 'backend-domain';

import { InMemoryUserRepository } from '../../../adapters';
import { ExecutionContext } from '../../../utils';

import { UpdateUserCommand, UpdateUserHandler } from './update-user.command';

describe('UpdateUserCommand', () => {
  const generator = new StubGeneratorAdapter();
  const userRepository = new InMemoryUserRepository();
  const profileImageStore = new StubProfileImageStoreAdapter();

  const handler = new UpdateUserHandler(userRepository);

  const create = factories({ profileImageStore, generator });

  const userId = 'userId';
  const imageId = 'imageId';

  const profileImage = create.profileImage('imageId.jpg');

  const imageData = create.profileImageData({
    type: ProfileImageType.jpg,
    data: Buffer.from('data'),
  });

  const currentData = create.profileImageData({
    type: ProfileImageType.png,
    data: Buffer.from('current data'),
  });

  const execute = async (user: User, profileImage: ProfileImageData | null) => {
    await handler.handle(new UpdateUserCommand({ profileImage }), ExecutionContext.as(user));
  };

  it("sets the user's profile image", async () => {
    const user = create.user({ id: userId, profileImage: null });

    userRepository.add(user);
    generator.nextId = 'imageId';

    await execute(user, imageData);

    expect(userRepository.get(user.id)).toHaveProperty('profileImage', profileImage);

    expect(await profileImageStore.readProfileImage(profileImage)).toEqual(imageData);
  });

  it("changes the user's profile image", async () => {
    const user = create.user({ id: userId, profileImage: profileImage });

    userRepository.add(user);
    profileImageStore.set(profileImage, currentData);
    generator.nextId = imageId;

    await execute(user, imageData);

    expect(userRepository.get(user.id)).toHaveProperty('profileImage', profileImage);
    expect(await profileImageStore.readProfileImage(profileImage)).toEqual(imageData);
  });

  it("unsets the user's profile image", async () => {
    const user = create.user({ id: userId, profileImage: profileImage });

    userRepository.add(user);
    profileImageStore.set(profileImage, currentData);

    await execute(user, null);

    expect(userRepository.get(user.id)).toHaveProperty('profileImage', null);
    expect(await profileImageStore.readProfileImage(profileImage)).toBeDefined();
  });
});
