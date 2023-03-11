import { Module } from '@shakala/common';

import { AuthController } from './controllers/auth.controller';
import { CommentController } from './controllers/comment.controller';
import { ThreadController } from './controllers/thread.controller';
import { UserController } from './controllers/user.controller';
import { Server } from './infrastructure/server';
import { TestServer } from './tests/test-server';
import { API_TOKENS } from './tokens';

type ApiModuleConfig = {
  server: 'test' | 'prod';
};

export class ApiModule extends Module {
  configure(config: ApiModuleConfig): void {
    this.bindToken(API_TOKENS.controllers.authController, AuthController);
    this.bindToken(API_TOKENS.controllers.userController, UserController);
    this.bindToken(API_TOKENS.controllers.threadController, ThreadController);
    this.bindToken(API_TOKENS.controllers.commentController, CommentController);

    if (config.server === 'test') {
      this.bindToken(API_TOKENS.server, TestServer);
    } else {
      this.bindToken(API_TOKENS.server, Server);
    }
  }
}