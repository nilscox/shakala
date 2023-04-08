import { Module } from '@shakala/common';
import { Container } from 'brandi';

import { AccountController } from './controllers/account.controller';
import { AuthController } from './controllers/auth.controller';
import { CommentController } from './controllers/comment.controller';
import { HealthcheckController } from './controllers/healthcheck.controller';
import { NotificationController } from './controllers/notification.controller';
import { ThreadController } from './controllers/thread.controller';
import { UserController } from './controllers/user.controller';
import { Server } from './infrastructure/server';
import { API_TOKENS } from './tokens';

export class ApiModule extends Module {
  init(container: Container) {
    this.expose(container, API_TOKENS.controllers)
    container.use(API_TOKENS.server).from(this)
  }

  async close(container: Container): Promise<void> {
    await container.get(API_TOKENS.server).close();
  }
}

export const module = new ApiModule()

module.bind(API_TOKENS.controllers.healthcheckController).toInstance(HealthcheckController).inSingletonScope();
module.bind(API_TOKENS.controllers.authController).toInstance(AuthController).inSingletonScope();
module.bind(API_TOKENS.controllers.accountController).toInstance(AccountController).inSingletonScope();
module.bind(API_TOKENS.controllers.threadController).toInstance(ThreadController).inSingletonScope();
module.bind(API_TOKENS.controllers.userController).toInstance(UserController).inSingletonScope();
module.bind(API_TOKENS.controllers.commentController).toInstance(CommentController).inSingletonScope();
module.bind(API_TOKENS.controllers.notificationController).toInstance(NotificationController).inSingletonScope();

module.bind(API_TOKENS.server).toInstance(Server).inSingletonScope();
