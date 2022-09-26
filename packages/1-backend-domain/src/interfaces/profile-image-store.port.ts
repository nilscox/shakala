import { ProfileImage, ProfileImageData } from '../entities/profile-image.value-object';

export interface ProfileImageStorePort {
  readProfileImage(image: ProfileImage): Promise<ProfileImageData | undefined>;
  writeProfileImage(userId: string, image: ProfileImage, data: ProfileImageData): Promise<void>;
  deleteProfileImage(image: ProfileImage): Promise<void>;
}
