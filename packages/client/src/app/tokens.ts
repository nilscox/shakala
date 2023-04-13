import { token } from 'brandi';

import { AccountPort } from '~/adapters/api/account/account.port';
import { AuthenticationPort } from '~/adapters/api/authentication/authentication.port';
import { CommentPort } from '~/adapters/api/comment/comment.port';
import { ThreadPort } from '~/adapters/api/thread/thread.port';
import { AppConfig } from '~/adapters/config/app-config';
import { HttpPort } from '~/adapters/http/http.port';
import { RouterPort } from '~/adapters/router/router.port';

export const TOKENS = {
  config: token<AppConfig>('config'),
  router: token<RouterPort>('router'),
  fetch: token<typeof globalThis.fetch>('fetch'),
  http: token<HttpPort>('http'),
  account: token<AccountPort>('account'),
  authentication: token<AuthenticationPort>('authentication'),
  comment: token<CommentPort>('comment'),
  thread: token<ThreadPort>('thread'),
};
