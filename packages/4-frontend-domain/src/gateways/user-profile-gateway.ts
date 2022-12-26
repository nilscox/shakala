import { UserActivity } from '../modules/user-account';
import { Paginated } from '../utils/pagination';

export interface UserProfileGateway {
  fetchActivities(page: number): Promise<Paginated<UserActivity>>;
  // todo: remove dependency to File (DOM)
  changeProfileImage(image: File): Promise<string>;
}
