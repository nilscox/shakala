import { InvalidImageFormat, Paginated, UserActivity, UserProfileGateway } from 'frontend-domain';
import { UserActivityDto, UserActivityType } from 'shared';

import { HttpGateway } from '../http-gateway/http.gateway';

export class ApiUserProfileGateway implements UserProfileGateway {
  constructor(private readonly http: HttpGateway) {}

  async fetchActivities(page: number): Promise<Paginated<UserActivity<UserActivityType>>> {
    const response = await this.http.get<UserActivityDto<UserActivityType>[], { page: number }>(
      '/user/activities',
      { query: { page } },
    );

    const total = Number(response.headers.get('pagination-total'));

    return {
      items: response.body,
      total,
    };
  }

  async changeProfileImage(image: File): Promise<string> {
    const body = new FormData();

    body.set('profileImage', image);

    const response = await this.http.post<string, FormData>(`/account/profile-image`, {
      body,
      onError: (error) => {
        if (error.status === 400 && error.response.body.code === 'InvalidImageFormat') {
          throw new InvalidImageFormat();
        }

        throw error;
      },
    });

    return response.body;
  }
}
