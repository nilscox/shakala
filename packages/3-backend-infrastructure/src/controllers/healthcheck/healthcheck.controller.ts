import { EntityManager } from '@mikro-orm/postgresql';

import { Controller, Response } from '../../infrastructure';
import { LoggerService } from '../../infrastructure/services/logger.service';

export class HealthcheckController extends Controller {
  constructor(logger: LoggerService, private readonly em: EntityManager) {
    super(logger, '/healthcheck');
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
