import { ApiAuthenticationAdapter } from './adapters/api/authentication/api-authentication.adapter';
import { AuthenticationPort } from './adapters/api/authentication/authentication.port';
import { ApiThreadAdapter } from './adapters/api/thread/api-thread.adapter';
import { ThreadPort } from './adapters/api/thread/thread.port';
import { FetchHttpAdapter } from './adapters/http/fetch-http.adapter';

type Config = {
  apiBaseUrl: string;
};

type DI = {
  config: Config;
  authentication: AuthenticationPort;
  thread: ThreadPort;
};

const config: Config = {
  apiBaseUrl: 'http://localhost:8000/api',
};

const http = new FetchHttpAdapter(config.apiBaseUrl);

export const di: DI = {
  config,
  authentication: new ApiAuthenticationAdapter(http),
  thread: new ApiThreadAdapter(http),
};

declare global {
  interface Window {
    // eslint-disable-next-line no-var
    di: DI;
  }
}

if (typeof window !== 'undefined') {
  window.di = di;
}
