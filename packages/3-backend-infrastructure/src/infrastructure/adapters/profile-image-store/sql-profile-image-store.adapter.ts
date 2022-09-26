import { EntityManager } from '@mikro-orm/postgresql';
import { ProfileImage, ProfileImageData, ProfileImageStorePort } from 'backend-domain';

import { SqlProfileImage, SqlUser } from '../../../persistence/entities';

export class SqlProfileImageStoreAdapter implements ProfileImageStorePort {
  constructor(private readonly em: EntityManager) {}

  get repository() {
    return this.em.getRepository(SqlProfileImage);
  }

  private async find(image: ProfileImage): Promise<SqlProfileImage | null> {
    return this.repository.findOne({ name: image.toString() });
  }

  async readProfileImage(image: ProfileImage): Promise<ProfileImageData | undefined> {
    const profileImage = await this.find(image);

    if (!profileImage) {
      return undefined;
    }

    return new ProfileImageData({
      type: profileImage.type,
      data: profileImage.data,
    });
  }

  async writeProfileImage(userId: string, image: ProfileImage, data: ProfileImageData): Promise<void> {
    const entity = (await this.find(image)) ?? new SqlProfileImage();

    entity.name = image.toString();
    entity.data = data.data;
    entity.type = data.type;
    entity.user = this.em.getReference(SqlUser, userId);

    await this.repository.persistAndFlush(entity);
  }

  async deleteProfileImage(image: ProfileImage): Promise<void> {
    const entity = await this.find(image);

    if (entity) {
      await this.repository.removeAndFlush(entity);
    }
  }
}
