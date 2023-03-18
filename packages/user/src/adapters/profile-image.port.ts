import { User } from '../entities/user.entity';

export interface ProfileImagePort {
  getProfileImageUrl(user: User): Promise<string>;
}
