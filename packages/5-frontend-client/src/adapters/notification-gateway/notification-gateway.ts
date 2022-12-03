import { Notification, NotificationGateway, Paginated } from 'frontend-domain';
import { PaginationQueryDto } from 'shared';

import { HttpGateway } from '../http-gateway/http.gateway';

export class ApiNotificationGateway implements NotificationGateway {
  constructor(private readonly http: HttpGateway) {}

  async fetchUnseenNotificationsCount(): Promise<number> {
    const response = await this.http.get<number>('/account/notifications/count');
    return response.body;
  }

  async fetchNotifications(page: number): Promise<Paginated<Notification>> {
    const response = await this.http.get<Notification[], PaginationQueryDto>(`/account/notifications`, {
      query: { page: String(page), pageSize: String(10) },
    });

    const total = Number(response.headers.get('pagination-total'));

    return {
      items: response.body,
      total,
    };
  }

  async markNotificationAsSeen(notificationId: string): Promise<void> {
    await this.http.put(`/account/notifications/${notificationId}/seen`);
  }
}
