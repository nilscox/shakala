import { EntityManager } from '@mikro-orm/postgresql';
import { LoggerService } from 'backend-application';

import { ConfigService, Controller, Response } from '../../infrastructure';

export class HealthcheckController extends Controller {
  constructor(
    logger: LoggerService,
    private readonly configService: ConfigService,
    private readonly em: EntityManager,
  ) {
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
    return Response.ok(this.configService.app().version);
  }
}
