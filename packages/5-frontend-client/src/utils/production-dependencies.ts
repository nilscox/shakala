import { Dependencies, StorageGateway } from 'frontend-domain';

import { ApiAuthenticationGateway } from '../adapters/authentication-gateway/api-authentication.gateway';
import { RealDateGateway } from '../adapters/date-gateway/real-date-gateway';
import { FetchHttpGateway } from '../adapters/http-gateway/fetch-http.gateway';
import { ConsoleLoggerGateway } from '../adapters/logger-gateway/console-logger.gateway';
import { NextRouterGateway } from '../adapters/router-gateway/next-router-gateway';
import { ConsoleLogSnackbarGateway } from '../adapters/snackbar-gateway/console-log-snackbar-gateway';
import { LocalStorageGateway } from '../adapters/storage-gateway/local-storage-gateway';
import { ApiThreadGateway } from '../adapters/thread-gateway/api-thread-gateway';
import { RealTimerGateway } from '../adapters/timer-gateway/timer-gateway';
import { ApiUserGateway } from '../adapters/user-gateway/api-user-gateway';

interface ProductionDependencies extends Dependencies {
  dateGateway: RealDateGateway;
  snackbarGateway: ConsoleLogSnackbarGateway;
  loggerGateway: ConsoleLoggerGateway;
  routerGateway: NextRouterGateway;
  timerGateway: RealTimerGateway;
  storageGateway: StorageGateway;
  authenticationGateway: ApiAuthenticationGateway;
  threadGateway: ApiThreadGateway;
  userGateway: ApiUserGateway;
}

const http = new FetchHttpGateway('http://localhost:3000');

const dateGateway = new RealDateGateway();
const snackbarGateway = new ConsoleLogSnackbarGateway();
const loggerGateway = new ConsoleLoggerGateway();
const routerGateway = new NextRouterGateway();
const timerGateway = new RealTimerGateway();
const storageGateway = new LocalStorageGateway();

export const productionDependencies: ProductionDependencies = {
  dateGateway,
  snackbarGateway,
  loggerGateway,
  routerGateway,
  timerGateway,
  storageGateway,
  authenticationGateway: new ApiAuthenticationGateway(http),
  threadGateway: new ApiThreadGateway(http),
  userGateway: new ApiUserGateway(http),
};

class StubStorageGateway implements StorageGateway {
  async getDraftCommentText(): Promise<string | undefined> {
    return;
  }

  async setDraftCommentText(): Promise<void> {}

  async removeDraftCommentText(): Promise<void> {}
}

if (typeof window === 'undefined') {
  productionDependencies.storageGateway = new StubStorageGateway();
}
