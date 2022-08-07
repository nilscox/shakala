import { EntityManager } from '@mikro-orm/postgresql';

import { Controller, Response } from '../../infrastructure';

export class HealthcheckController extends Controller {
  constructor(private readonly em: EntityManager) {
    super('/healthcheck');
  }

  endpoints() {
    return {
      'GET /': this.healthcheck,
    };
  }

  async healthcheck() {
    return Response.ok({
      api: true,
      database: await this.checkDatabaseConnection(),
    });
  }

  private async checkDatabaseConnection() {
    return this.em.getConnection().isConnected();
  }
}
