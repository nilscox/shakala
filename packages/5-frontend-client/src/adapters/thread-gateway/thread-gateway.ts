import { ThreadGateway, Thread } from 'frontend-domain';
import { ThreadDto } from 'shared';

import { HttpGateway } from '../http-gateway/http.gateway';

export class ApiThreadGateway implements ThreadGateway {
  constructor(private readonly http: HttpGateway) {}

  async getLast(count: number): Promise<Thread[]> {
    const response = await this.http.get<ThreadDto[]>('/thread/last', {
      query: { count },
    });

    return response.body;
  }
}
