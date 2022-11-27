import { Notification, NotificationGateway, Paginated } from 'frontend-domain';

import { HttpGateway } from '../http-gateway/http.gateway';

export class ApiNotificationGateway implements NotificationGateway {
  constructor(private readonly http: HttpGateway) {}

  async fetchUnseenNotificationsCount(): Promise<number> {
    const response = await this.http.get<number>('/account/notifications/count');
    return response.body;
  }

  // todo: refactor using query
  async fetchNotifications(page: number): Promise<Paginated<Notification>> {
    const query = new URLSearchParams({ page: String(page), pageSize: String(10) });
    const response = await this.http.get<Notification[]>(`/account/notifications?${query}`);
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
