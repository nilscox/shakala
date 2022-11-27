import { createNormalizationMiddleware } from '@nilscox/redux-kooltik';
import { composeWithDevTools } from '@redux-devtools/extension';
import {
  AnyAction,
  applyMiddleware,
  combineReducers,
  legacy_createStore as createReduxStore,
  Middleware,
  Store,
} from 'redux';
import thunkMiddleware, { ThunkAction, ThunkDispatch, ThunkMiddleware } from 'redux-thunk';

import { TimerGateway } from './gateways';
import { AuthenticationGateway } from './gateways/authentication-gateway';
import { CommentGateway } from './gateways/comment-gateway';
import { DateGateway } from './gateways/date-gateway';
import { DraftMessagesGateway } from './gateways/draft-messages.gateway';
import { LoggerGateway } from './gateways/logger-gateway';
import { NotificationGateway } from './gateways/notification-gateway';
import { SnackbarGateway } from './gateways/snackbar.gateway';
import { ThreadGateway } from './gateways/thread-gateway';
import { UserProfileGateway } from './gateways/user-profile-gateway';
import { authenticationActions } from './modules/authentication';
import { commentActions } from './modules/comment';
import { notificationActions } from './modules/notification';
import { routerActions } from './modules/router';
import { threadActions } from './modules/thread';
import { userActions } from './modules/user';
import { userActivityActions, userProfileActions } from './modules/user-account';

export type Dependencies = {
  authenticationGateway: AuthenticationGateway;
  commentGateway: CommentGateway;
  dateGateway: DateGateway;
  draftMessagesGateway: DraftMessagesGateway;
  loggerGateway: LoggerGateway;
  notificationGateway: NotificationGateway;
  snackbarGateway: SnackbarGateway;
  timerGateway: TimerGateway;
  threadGateway: ThreadGateway;
  userProfileGateway: UserProfileGateway;
};

export type AppState = ReturnType<typeof rootReducer>;
export type AppStore = Store<AppState> & { dispatch: AppThunkDispatch };

export type AppSelector<Params extends unknown[], Result> = (state: AppState, ...params: Params) => Result;

type AppThunkMiddleware = ThunkMiddleware<AppState, AnyAction, Dependencies>;
type AppThunkDispatch = ThunkDispatch<AppState, Dependencies, AnyAction>;
export type AppThunk<Result = Promise<void>> = ThunkAction<Result, AppState, Dependencies, AnyAction>;

const rootReducer = combineReducers({
  authentication: authenticationActions.reducer(),
  comment: commentActions.reducer(),
  notification: notificationActions.reducer(),
  router: routerActions.reducer(),
  thread: threadActions.reducer(),
  user: userActions.reducer(),
  userAccount: combineReducers({
    profile: userProfileActions.reducer(),
    activity: userActivityActions.reducer(),
  }),
});

const normalizationMiddleware = createNormalizationMiddleware({
  comment: commentActions.setNormalizedComments,
  thread: threadActions.setNormalizedThreads,
  user: userActions.setNormalizedUsers,
});

export const createStore = (
  dependencies: Dependencies,
  preloadedState?: AppState,
  middlewares: Middleware[] = [],
) => {
  const enhancer = applyMiddleware<AppThunkDispatch>(
    normalizationMiddleware,
    thunkMiddleware.withExtraArgument(dependencies) as AppThunkMiddleware,
    // logActionsMiddleware,
    ...middlewares,
  );

  return createReduxStore(rootReducer, preloadedState, composeWithDevTools(enhancer) as typeof enhancer);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logActionsMiddleware: Middleware = (_store) => (next) => (action) => {
  console.log(action);
  return next(action);
};
