import { UserActivity } from '../modules/user-account';
import { Paginated } from '../types';

export class InvalidImageFormat extends Error {
  constructor() {
    super('Invalid image format');
  }
}

export interface UserProfileGateway {
  fetchActivities(page: number): Promise<Paginated<UserActivity>>;
  // todo: remove dependency to File (DOM)
  changeProfileImage(image: File): Promise<string>;
}
