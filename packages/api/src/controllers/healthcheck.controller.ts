import { ConfigPort, TOKENS } from '@shakala/common';
import { injected } from 'brandi';
import { RequestHandler, Router } from 'express';

export class HealthcheckController {
  public readonly router: Router = Router();

  constructor(private readonly config: ConfigPort) {
    this.router.get('/healthcheck', this.healthcheck);
    this.router.get('/version', this.version);
  }

  healthcheck: RequestHandler = async (req, res) => {
    res.status(200);
    res.json({
      api: true,
    });
  };

  version: RequestHandler = async (req, res) => {
    res.status(200);
    res.send(this.config.app.version);
  };
}

injected(HealthcheckController, TOKENS.config);
