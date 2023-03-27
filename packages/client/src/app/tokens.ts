import { token } from 'brandi';

import { AuthenticationPort } from '~/adapters/api/authentication/authentication.port';
import { ThreadPort } from '~/adapters/api/thread/thread.port';
import { HttpPort } from '~/adapters/http/http.port';
import { RouterPort } from '~/adapters/router/router.port';

import { AppConfig } from './container';

export const TOKENS = {
  config: token<AppConfig>('config'),
  router: token<RouterPort>('router'),
  http: token<HttpPort>('http'),
  authentication: token<AuthenticationPort>('authentication'),
  thread: token<ThreadPort>('thread'),
};
