import { Dependencies, DraftsGateway, SnackbarGateway } from 'frontend-domain';

import { ApiAuthenticationGateway } from '../adapters/authentication-gateway/api-authentication.gateway';
import { ApiCommentGateway } from '../adapters/comment-gateway/api-comment-gateway';
import { RealDateGateway } from '../adapters/date-gateway/real-date-gateway';
import { LocalStorageDraftsGateway } from '../adapters/drafts-gateway/local-storage-drafts.gateway';
import { ApiFetchHttpGateway } from '../adapters/http-gateway/api-fetch-http.gateway';
import { ConsoleLoggerGateway } from '../adapters/logger-gateway/console-logger.gateway';
import { ApiNotificationGateway } from '../adapters/notification-gateway/notification-gateway';
import { ConsoleLogSnackbarGateway } from '../adapters/snackbar-gateway/console-log-snackbar-gateway';
import { ApiThreadGateway } from '../adapters/thread-gateway/api-thread-gateway';
import { RealTimerGateway } from '../adapters/timer-gateway/timer-gateway';
import { ApiUserProfileGateway } from '../adapters/user-profile-gateway/api-user-profile-gateway';

interface ProductionDependencies extends Dependencies {
  authenticationGateway: ApiAuthenticationGateway;
  commentGateway: ApiCommentGateway;
  dateGateway: RealDateGateway;
  draftsGateway: DraftsGateway;
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
  const http = new ApiFetchHttpGateway(options.apiBaseUrl);

  http.cookie = options.cookie;

  return {
    authenticationGateway: new ApiAuthenticationGateway(http),
    commentGateway: new ApiCommentGateway(http),
    dateGateway: new RealDateGateway(),
    draftsGateway: new LocalStorageDraftsGateway(),
    loggerGateway: new ConsoleLoggerGateway(),
    notificationGateway: new ApiNotificationGateway(http),
    snackbarGateway: options.snackbar ?? new ConsoleLogSnackbarGateway(),
    threadGateway: new ApiThreadGateway(http),
    timerGateway: new RealTimerGateway(),
    userProfileGateway: new ApiUserProfileGateway(http),
  };
};
