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
});
