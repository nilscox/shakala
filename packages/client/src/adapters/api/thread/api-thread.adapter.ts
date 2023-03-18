import { ThreadDto } from '@shakala/shared';

import { ApiAdapter } from '../api-adapter';

import { ThreadPort } from './thread.port';

export class ApiThreadAdapter extends ApiAdapter implements ThreadPort {
  async getLastThreads(count: number): Promise<ThreadDto[]> {
    const response = await this.http.get<ThreadDto[]>('/thread', { search: { count } });
    return response.body;
  }
}
