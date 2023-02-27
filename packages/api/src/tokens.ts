import { token } from 'brandi';

import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { Server } from './infrastructure/server';
import { TestServer } from './tests/test-server';

export const API_TOKENS = {
  authController: token<AuthController>('authController'),
  userController: token<UserController>('userController'),
  server: token<Server>('server'),
  testServer: token<TestServer>('testServer'),
};
