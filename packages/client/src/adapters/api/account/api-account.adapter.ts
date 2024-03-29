import { NotificationDto, UserActivityDto } from '@shakala/shared';
import { injected } from 'brandi';

import { TOKENS } from '~/app/tokens';
import { Page } from '~/utils/page';

import { HttpPort } from '../../http/http.port';

import { AccountPort } from './account.port';

export class ApiAccountAdapter implements AccountPort {
  constructor(protected readonly http: HttpPort) {}

  async validateEmail(token: string): Promise<void> {
    await this.http.get(`/account/validate-email/${token}`);
  }

  async getUserActivities(page?: number): Promise<Page<UserActivityDto>> {
    const response = await this.http.get<UserActivityDto[]>('/account/activities', { search: { page } });

    return {
      items: response.body,
      total: Number(response.headers.get('Pagination-Total')),
    };
  }

  async getNotificationsCount(): Promise<number> {
    const response = await this.http.get<number>('/notification/count');
    return response.body;
  }

  async getNotifications(page?: number): Promise<Page<NotificationDto>> {
    const response = await this.http.get<NotificationDto[]>('/notification', { search: { page } });

    return {
      items: response.body,
      total: Number(response.headers.get('Pagination-Total')),
    };
  }

  async markNotificationAsSeen(notificationId: string): Promise<void> {
    await this.http.put(`/notification/${notificationId}/seen`);
  }

  async changeNick(nick: string): Promise<void> {
    await this.http.put('/account/profile', { nick });
  }
}

injected(ApiAccountAdapter, TOKENS.http);
