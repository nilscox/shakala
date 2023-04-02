import expect from '@nilscox/expect';
import { beforeEach, describe, it } from 'vitest';

import { createPage } from '~/utils/page';

import { StubHttpAdapter } from '../../http/stub-http.adapter';

import { ApiAccountAdapter } from './api-account.adapter';

describe('ApiAccountAdapter', () => {
  let http: StubHttpAdapter;
  let adapter: ApiAccountAdapter;

  beforeEach(() => {
    http = new StubHttpAdapter();
    adapter = new ApiAccountAdapter(http);
  });

  describe('getUserActivities', () => {
    it("fetches the list of user's activities", async () => {
      http.response = { body: [], headers: new Headers({ 'Pagination-Total': '0' }) };

      await expect(adapter.getUserActivities()).toResolve(createPage([]));

      expect(http.requests).toInclude({ method: 'GET', url: '/account/activities', search: {} });
    });

    it("fetches the list of user's activities on a given page", async () => {
      http.response = { body: [], headers: new Headers({ 'Pagination-Total': '0' }) };

      await expect(adapter.getUserActivities(42)).toResolve(createPage([]));

      expect(http.requests).toInclude({ method: 'GET', url: '/account/activities', search: { page: 42 } });
    });
  });

  describe('getNotificationsCount', () => {
    it('fetches the total number of unseen notifications', async () => {
      http.response = { body: 42 };

      await expect(adapter.getNotificationsCount()).toResolve(42);

      expect(http.requests).toInclude({ method: 'GET', url: '/notification/count' });
    });
  });

  describe('getNotifications', () => {
    it('fetches the list of notifications', async () => {
      http.response = { body: [], headers: new Headers({ 'Pagination-Total': '0' }) };

      await expect(adapter.getNotifications()).toResolve({ items: [], total: 0 });

      expect(http.requests).toInclude({ method: 'GET', url: '/notification', search: {} });
    });

    it('fetches the list of notifications on a given page', async () => {
      http.response = { body: [], headers: new Headers({ 'Pagination-Total': '0' }) };

      await expect(adapter.getNotifications(51)).toResolve();

      expect(http.requests).toInclude({ method: 'GET', url: '/notification', search: { page: 51 } });
    });
  });

  describe('markNotificationAsSeen', () => {
    it('marks a notification as seen', async () => {
      http.response = {};

      await expect(adapter.markNotificationAsSeen('notificationId')).toResolve();

      expect(http.requests).toInclude({ method: 'PUT', url: '/notification/notificationId/seen' });
    });
  });
});
