import { createDomainDependencies, factories, ProfileImageType } from 'backend-domain';

import { SqlUserRepository } from '../../../persistence';
import { SqlProfileImage, SqlUser } from '../../../persistence/entities';
import { setupTestDatabase } from '../../../persistence/mikro-orm/create-database-connection';

import { SqlProfileImageStoreService } from './sql-profile-image-store.service';

describe('SqlProfileImageStoreService', () => {
  const { getEntityManager, waitForDatabaseConnection } = setupTestDatabase();

  const create = factories();
  const user = create.user();

  beforeEach(async () => {
    await waitForDatabaseConnection();

    const deps = createDomainDependencies();
    const userRepository = new SqlUserRepository(getEntityManager(), deps);

    await userRepository.save(user);
  });

  it('retrieves an existing profile image', async () => {
    const em = getEntityManager();
    const repository = await em.getRepository(SqlProfileImage);

    const data = Buffer.from('image');

    await repository.persistAndFlush(
      Object.assign(new SqlProfileImage(), {
        user: em.getReference(SqlUser, user.id),
        name: 'image.jpg',
        type: ProfileImageType.jpg,
        data,
      }),
    );

    const profileImageStoreService = new SqlProfileImageStoreService();
    profileImageStoreService.entityManager = em;

    const result = await profileImageStoreService.readProfileImage(create.profileImage('image.jpg'));

    expect(result).toEqual(create.profileImageData({ type: ProfileImageType.jpg, data }));
  });

  it('creates a new profile image', async () => {
    const em = getEntityManager();
    const repository = await em.getRepository(SqlProfileImage);

    const profileImageStoreService = new SqlProfileImageStoreService();
    profileImageStoreService.entityManager = em;

    const data = Buffer.from('image');

    await profileImageStoreService.writeProfileImage(
      user.id,
      create.profileImage('image.png'),
      create.profileImageData({ data }),
    );

    const saved = await repository.findOne({ name: 'image.png' });

    expect(saved).not.toBeNull();
    expect(saved).toHaveProperty('name', 'image.png');
    expect(saved).toHaveProperty('data', data);
  });

  it('updates an existing profile image', async () => {
    const em = getEntityManager();
    const repository = await em.getRepository(SqlProfileImage);

    const data = Buffer.from('image');
    const newData = Buffer.from('new image');

    await repository.persistAndFlush(
      Object.assign(new SqlProfileImage(), {
        user: em.getReference(SqlUser, user.id),
        name: 'image.png',
        type: ProfileImageType.png,
        data,
      }),
    );

    const profileImageStoreService = new SqlProfileImageStoreService();
    profileImageStoreService.entityManager = em;

    await profileImageStoreService.writeProfileImage(
      user.id,
      create.profileImage('image.bmp'),
      create.profileImageData({ type: ProfileImageType.bmp, data: newData }),
    );

    const saved = await repository.findOne({ name: 'image.bmp' });

    expect(saved).toHaveProperty('name', 'image.bmp');
    expect(saved).toHaveProperty('type', ProfileImageType.bmp);
    expect(saved).toHaveProperty('data', newData);
  });
});
