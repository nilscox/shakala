import { Paginated, UserActivity } from '../types';

export interface UserGateway {
  changeProfileImage(image: File): Promise<string>;
  listActivities(page: number): Promise<Paginated<UserActivity>>;
}
