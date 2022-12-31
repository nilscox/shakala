import { EntityManager } from '@mikro-orm/postgresql';
import { LoggerPort } from '@shakala/backend-application';

import { ConfigPort, Controller, Response } from '../../infrastructure';

export class HealthcheckController extends Controller {
  constructor(logger: LoggerPort, private readonly config: ConfigPort, private readonly em: EntityManager) {
    super(logger);
  }

  endpoints() {
    return {
      'GET /healthcheck': this.healthcheck,
      'GET /version': this.version,
    };
  }

  async healthcheck(): Promise<Response<{ api: boolean; database: boolean }>> {
    return Response.ok({
      api: true,
      database: await this.checkDatabaseConnection(),
    });
  }

  private async checkDatabaseConnection() {
    return this.em.getConnection().isConnected();
  }

  version(): Response<string> {
    return Response.ok(this.config.app().version);
  }
}
