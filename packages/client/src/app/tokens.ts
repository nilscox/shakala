import { token } from 'brandi';

import { AuthenticationPort } from '~/adapters/api/authentication/authentication.port';
import { CommentPort } from '~/adapters/api/comment/comment.port';
import { ThreadPort } from '~/adapters/api/thread/thread.port';
import { HttpPort } from '~/adapters/http/http.port';
import { RouterPort } from '~/adapters/router/router.port';

import { AppConfig } from './container';

export const TOKENS = {
  config: token<AppConfig>('config'),
  router: token<RouterPort>('router'),
  fetch: token<typeof globalThis.fetch>('fetch'),
  http: token<HttpPort>('http'),
  authentication: token<AuthenticationPort>('authentication'),
  thread: token<ThreadPort>('thread'),
  comment: token<CommentPort>('comment'),
};
