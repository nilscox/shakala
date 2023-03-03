import { token } from 'brandi';

import { AuthController } from './controllers/auth.controller';
import { CommentController } from './controllers/comment.controller';
import { ThreadController } from './controllers/thread.controller';
import { UserController } from './controllers/user.controller';
import { Server } from './infrastructure/server';

export const API_TOKENS = {
  controllers: {
    authController: token<AuthController>('authController'),
    userController: token<UserController>('userController'),
    threadController: token<ThreadController>('threadController'),
    commentController: token<CommentController>('commentController'),
  },
  server: token<Server>('server'),
};
