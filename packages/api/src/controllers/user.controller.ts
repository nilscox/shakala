import { QueryBus, TOKENS } from '@shakala/common';
import { getProfileImage } from '@shakala/user';
import { injected } from 'brandi';
import { RequestHandler, Router } from 'express';
import httpProxy from 'http-proxy';

export class UserController {
  public readonly router: Router = Router();

  private proxy = httpProxy.createProxyServer();

  constructor(private readonly queryBus: QueryBus) {
    this.router.get('/:userId/profile-image', this.getProfileImage);
  }

  getProfileImage: RequestHandler<{ userId: string }> = async (req, res, next) => {
    const url = await this.queryBus.execute(
      getProfileImage({
        userId: req.params.userId,
      })
    );

    this.proxy.web(req, res, { target: url, ignorePath: true, changeOrigin: true }, next);
  };
}

injected(UserController, TOKENS.queryBus);
