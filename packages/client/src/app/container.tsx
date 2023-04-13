import { Container, createContainer } from 'brandi';

import { ApiAccountAdapter } from '~/adapters/api/account/api-account.adapter';
import { ApiAuthenticationAdapter } from '~/adapters/api/authentication/api-authentication.adapter';
import { ApiCommentAdapter } from '~/adapters/api/comment/api-comment.adapter';
import { ApiThreadAdapter } from '~/adapters/api/thread/api-thread.adapter';
import { envConfig } from '~/adapters/config/env-config.adapter';
import { ApiFetchHttpAdapter } from '~/adapters/http/fetch-http.adapter';
import { VPSRouterAdapter } from '~/adapters/router/vps-router.adapter';

import { TOKENS } from './tokens';

type TOKENS_TYPE = typeof TOKENS;

declare global {
  // eslint-disable-next-line no-var
  var container: Container;

  // eslint-disable-next-line no-var
  var TOKENS: TOKENS_TYPE;
}

export const container = createContainer();

globalThis.container = container;
globalThis.TOKENS = TOKENS;

container.bind(TOKENS.config).toConstant(envConfig);
container.bind(TOKENS.router).toInstance(VPSRouterAdapter).inSingletonScope();
container.bind(TOKENS.http).toInstance(ApiFetchHttpAdapter).inSingletonScope();
container.bind(TOKENS.account).toInstance(ApiAccountAdapter).inSingletonScope();
container.bind(TOKENS.authentication).toInstance(ApiAuthenticationAdapter).inSingletonScope();
container.bind(TOKENS.comment).toInstance(ApiCommentAdapter).inSingletonScope();
container.bind(TOKENS.thread).toInstance(ApiThreadAdapter).inSingletonScope();
