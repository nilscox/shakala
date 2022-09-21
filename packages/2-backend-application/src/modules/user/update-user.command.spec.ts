import { factories, ProfileImageData, ProfileImageType, StubGeneratorService, User } from 'backend-domain';
import { StubProfileImageStoreService } from 'backend-domain/src/utils/stub-profile-image-store.service';

import { ExecutionContext } from '../../utils/execution-context';

import { UpdateUserCommand, UpdateUserHandler } from './update-user.command';
import { InMemoryUserRepository } from './user.in-memory-repository';

describe('UpdateUserCommand', () => {
  const userRepository = new InMemoryUserRepository();
  const profileImageStoreService = new StubProfileImageStoreService();
  const handler = new UpdateUserHandler(userRepository);

  const generatorService = new StubGeneratorService();
  const create = factories({ profileImageStoreService, generatorService });

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
    generatorService.nextId = 'imageId';

    await execute(user, imageData);

    expect(userRepository.get(user.id)).toHaveProperty('profileImage', profileImage);

    expect(await profileImageStoreService.readProfileImage(profileImage)).toEqual(imageData);
  });

  it("changes the user's profile image", async () => {
    const user = create.user({ id: userId, profileImage: profileImage });

    userRepository.add(user);
    profileImageStoreService.set(profileImage, currentData);
    generatorService.nextId = imageId;

    await execute(user, imageData);

    expect(userRepository.get(user.id)).toHaveProperty('profileImage', profileImage);
    expect(await profileImageStoreService.readProfileImage(profileImage)).toEqual(imageData);
  });

  it("unsets the user's profile image", async () => {
    const user = create.user({ id: userId, profileImage: profileImage });

    userRepository.add(user);
    profileImageStoreService.set(profileImage, currentData);

    await execute(user, null);

    expect(userRepository.get(user.id)).toHaveProperty('profileImage', null);
    expect(await profileImageStoreService.readProfileImage(profileImage)).not.toBeUndefined();
  });
});
