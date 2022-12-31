import { Paginated, UserActivity, UserProfileGateway } from '@shakala/frontend-domain';
import { UserActivityDto, UserActivityType } from '@shakala/shared';

import { HttpGateway } from '../http-gateway/http.gateway';

export class ApiUserProfileGateway implements UserProfileGateway {
  constructor(private readonly http: HttpGateway) {}

  async fetchActivities(page: number): Promise<Paginated<UserActivity<UserActivityType>>> {
    const response = await this.http.read<UserActivityDto<UserActivityType>[], { page: number }>(
      'get',
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

    const response = await this.http.write<string, FormData>('post', `/account/profile-image`, {
      body,
    });

    return response.body;
  }
}
