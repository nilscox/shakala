import { token } from 'brandi';

import { AuthController } from './controllers/auth.controller';
import { Server } from './infrastructure/server';
import { TestServer } from './tests/test-server';

export const API_TOKENS = {
  authController: token<AuthController>('authController'),
  server: token<Server>('server'),
  testServer: token<TestServer>('testServer'),
};
