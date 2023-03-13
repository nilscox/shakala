import { Module } from '@shakala/common';

import { AccountController } from './controllers/account.controller';
import { AuthController } from './controllers/auth.controller';
import { CommentController } from './controllers/comment.controller';
import { HealthcheckController } from './controllers/healthcheck.controller';
import { NotificationController } from './controllers/notification.controller';
import { ThreadController } from './controllers/thread.controller';
import { Server } from './infrastructure/server';
import { TestServer } from './tests/test-server';
import { API_TOKENS } from './tokens';

type ApiModuleConfig = {
  server: 'test' | 'prod';
};

export class ApiModule extends Module {
  configure(config: ApiModuleConfig): void {
    this.bindToken(API_TOKENS.controllers.healthcheckController, HealthcheckController);
    this.bindToken(API_TOKENS.controllers.authController, AuthController);
    this.bindToken(API_TOKENS.controllers.accountController, AccountController);
    this.bindToken(API_TOKENS.controllers.threadController, ThreadController);
    this.bindToken(API_TOKENS.controllers.commentController, CommentController);
    this.bindToken(API_TOKENS.controllers.notificationController, NotificationController);

    if (config.server === 'test') {
      this.bindToken(API_TOKENS.server, TestServer);
    } else {
      this.bindToken(API_TOKENS.server, Server);
    }
  }
}
