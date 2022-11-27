import { Dependencies, DraftMessagesGateway, SnackbarGateway } from 'frontend-domain';

import { ApiAuthenticationGateway } from '../adapters/authentication-gateway/api-authentication.gateway';
import { ApiCommentGateway } from '../adapters/comment-gateway/api-comment-gateway';
import { RealDateGateway } from '../adapters/date-gateway/real-date-gateway';
import { FetchHttpGateway } from '../adapters/http-gateway/fetch-http.gateway';
import { ConsoleLoggerGateway } from '../adapters/logger-gateway/console-logger.gateway';
import { ApiNotificationGateway } from '../adapters/notification-gateway/notification-gateway';
import { ConsoleLogSnackbarGateway } from '../adapters/snackbar-gateway/console-log-snackbar-gateway';
import { LocalStorageGateway } from '../adapters/storage-gateway/local-storage-gateway';
import { ApiThreadGateway } from '../adapters/thread-gateway/api-thread-gateway';
import { RealTimerGateway } from '../adapters/timer-gateway/timer-gateway';
import { ApiUserProfileGateway } from '../adapters/user-profile-gateway/api-user-profile-gateway';

interface ProductionDependencies extends Dependencies {
  authenticationGateway: ApiAuthenticationGateway;
  commentGateway: ApiCommentGateway;
  dateGateway: RealDateGateway;
  draftMessagesGateway: DraftMessagesGateway;
  loggerGateway: ConsoleLoggerGateway;
  notificationGateway: ApiNotificationGateway;
  snackbarGateway: ConsoleLogSnackbarGateway;
  threadGateway: ApiThreadGateway;
  timerGateway: RealTimerGateway;
  userProfileGateway: ApiUserProfileGateway;
}

type DependenciesOptions = {
  apiBaseUrl: string;
  cookie?: string;
  snackbar?: SnackbarGateway;
};

export const productionDependencies = (options: DependenciesOptions): ProductionDependencies => {
  const http = new FetchHttpGateway(options.apiBaseUrl);

  http.cookie = options.cookie;

  return {
    authenticationGateway: new ApiAuthenticationGateway(http),
    commentGateway: new ApiCommentGateway(http),
    dateGateway: new RealDateGateway(),
    draftMessagesGateway: new LocalStorageGateway(),
    loggerGateway: new ConsoleLoggerGateway(),
    notificationGateway: new ApiNotificationGateway(http),
    snackbarGateway: options.snackbar ?? new ConsoleLogSnackbarGateway(),
    threadGateway: new ApiThreadGateway(http),
    timerGateway: new RealTimerGateway(),
    userProfileGateway: new ApiUserProfileGateway(http),
  };
};
