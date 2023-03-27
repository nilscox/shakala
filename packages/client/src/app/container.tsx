import { createContainer } from 'brandi';

import { ApiAuthenticationAdapter } from '~/adapters/api/authentication/api-authentication.adapter';
import { ApiThreadAdapter } from '~/adapters/api/thread/api-thread.adapter';
import { FetchHttpAdapter } from '~/adapters/http/fetch-http.adapter';
import { VPSRouterAdapter } from '~/adapters/router/vps-router.adapter';

import { TOKENS } from './tokens';

export type AppConfig = {
  apiBaseUrl: string;
};

const config: AppConfig = {
  apiBaseUrl: 'http://localhost:8000/api',
};

export const container = createContainer();

container.bind(TOKENS.config).toConstant(config);
container.bind(TOKENS.router).toInstance(VPSRouterAdapter).inSingletonScope();
container.bind(TOKENS.http).toInstance(FetchHttpAdapter).inSingletonScope();
container.bind(TOKENS.authentication).toInstance(ApiAuthenticationAdapter).inSingletonScope();
container.bind(TOKENS.thread).toInstance(ApiThreadAdapter).inSingletonScope();
