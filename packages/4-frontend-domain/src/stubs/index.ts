import { Dependencies } from '../store';
import { MockLoggerGateway } from '../test-store';

import { StubAuthenticationGateway } from './stub-authentication-gateway';
import { StubCommentGateway } from './stub-comment-gateway';
import { StubDateGateway } from './stub-date-gateway';
import { StubDraftMessagesGateway } from './stub-draft-messages-gateway';
import { StubNotificationGateway } from './stub-notification-gateway';
import { StubSnackbarGateway } from './stub-snackbar-gateway';
import { StubThreadGateway } from './stub-thread-gateway';
import { StubTimerGateway } from './stub-timer-gateway';
import { StubUserProfileGateway } from './stub-user-profile-gateway';

export { StubAuthenticationGateway } from './stub-authentication-gateway';
export { StubCommentGateway } from './stub-comment-gateway';
export { StubDateGateway } from './stub-date-gateway';
export { StubDraftMessagesGateway } from './stub-draft-messages-gateway';
export { StubNotificationGateway } from './stub-notification-gateway';
export { StubSnackbarGateway } from './stub-snackbar-gateway';
export { StubThreadGateway } from './stub-thread-gateway';
export { StubTimerGateway } from './stub-timer-gateway';
export { StubUserProfileGateway } from './stub-user-profile-gateway';

export interface StubDependencies extends Dependencies {
  authenticationGateway: StubAuthenticationGateway;
  commentGateway: StubCommentGateway;
  dateGateway: StubDateGateway;
  draftMessagesGateway: StubDraftMessagesGateway;
  loggerGateway: MockLoggerGateway;
  notificationGateway: StubNotificationGateway;
  snackbarGateway: StubSnackbarGateway;
  timerGateway: StubTimerGateway;
  threadGateway: StubThreadGateway;
  userProfileGateway: StubUserProfileGateway;
}

export const createStubDependencies = (): StubDependencies => ({
  authenticationGateway: new StubAuthenticationGateway(),
  dateGateway: new StubDateGateway(),
  commentGateway: new StubCommentGateway(),
  draftMessagesGateway: new StubDraftMessagesGateway(),
  loggerGateway: new MockLoggerGateway(),
  notificationGateway: new StubNotificationGateway(),
  snackbarGateway: new StubSnackbarGateway(),
  timerGateway: new StubTimerGateway(),
  threadGateway: new StubThreadGateway(),
  userProfileGateway: new StubUserProfileGateway(),
});
