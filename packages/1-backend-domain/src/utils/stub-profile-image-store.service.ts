import { ProfileImage, ProfileImageData } from '../entities/profile-image.value-object';
import { ProfileImageStoreService } from '../interfaces/profile-image-store-service.interface';

export class StubProfileImageStoreService implements ProfileImageStoreService {
  private images = new Map<string, ProfileImageData>();

  async readProfileImage(image: ProfileImage): Promise<ProfileImageData | undefined> {
    return this.images.get(image.toString());
  }

  async writeProfileImage(_userId: string, image: ProfileImage, data: ProfileImageData): Promise<void> {
    this.images.set(image.toString(), data);
  }

  async deleteProfileImage(image: ProfileImage): Promise<void> {
    this.images.delete(image.toString());
  }

  set(image: ProfileImage, data: ProfileImageData) {
    this.images.set(image.toString(), data);
  }
}
