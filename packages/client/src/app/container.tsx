import { Container, createContainer } from 'brandi';

import { ApiAuthenticationAdapter } from '~/adapters/api/authentication/api-authentication.adapter';
import { ApiCommentAdapter } from '~/adapters/api/comment/api-comment.adapter';
import { ApiThreadAdapter } from '~/adapters/api/thread/api-thread.adapter';
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

export type AppConfig = {
  isDevelopment: boolean;
  apiBaseUrl: string;
};

const config: AppConfig = {
  isDevelopment: true,
  apiBaseUrl: 'http://localhost:8000/api',
};

export const container = createContainer();

globalThis.container = container;
globalThis.TOKENS = TOKENS;

container.bind(TOKENS.config).toConstant(config);
container.bind(TOKENS.router).toInstance(VPSRouterAdapter).inSingletonScope();
container.bind(TOKENS.http).toInstance(ApiFetchHttpAdapter).inSingletonScope();
container.bind(TOKENS.authentication).toInstance(ApiAuthenticationAdapter).inSingletonScope();
container.bind(TOKENS.thread).toInstance(ApiThreadAdapter).inSingletonScope();
container.bind(TOKENS.comment).toInstance(ApiCommentAdapter).inSingletonScope();
