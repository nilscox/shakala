import { ThreadDto } from '@shakala/shared';

import { HttpPort } from '../../http/http.port';

import { ThreadPort } from './thread.port';

export class ApiThreadAdapter implements ThreadPort {
  constructor(private readonly http: HttpPort) {}

  async getLastThreads(count: number): Promise<ThreadDto[]> {
    const response = await this.http.get<ThreadDto[]>('/thread', { search: { count } });
    return response.body;
  }
}
