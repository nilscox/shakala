import { token } from 'brandi';

import { AccountController } from './controllers/account.controller';
import { AuthController } from './controllers/auth.controller';
import { CommentController } from './controllers/comment.controller';
import { HealthcheckController } from './controllers/healthcheck.controller';
import { NotificationController } from './controllers/notification.controller';
import { ThreadController } from './controllers/thread.controller';
import { UserController } from './controllers/user.controller';
import { Server } from './infrastructure/server';

export const API_TOKENS = {
  controllers: {
    healthcheckController: token<HealthcheckController>('healthcheckController'),
    authController: token<AuthController>('authController'),
    accountController: token<AccountController>('accountController'),
    threadController: token<ThreadController>('threadController'),
    userController: token<UserController>('userController'),
    commentController: token<CommentController>('commentController'),
    notificationController: token<NotificationController>('notificationController'),
  },
  server: token<Server>('server'),
};
