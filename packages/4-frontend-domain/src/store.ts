import {
  AnyAction,
  configureStore,
  Middleware,
  Selector as RTKSelector,
  ThunkAction,
} from '@reduxjs/toolkit';

import { AuthenticationGateway } from './authentication/authentication.gateway';
import { authenticationSlice } from './authentication/authentication.slice';
import { userReducer } from './authentication/user.slice';
import { commentsReducer } from './comment/comments.slice';
import { DateGateway } from './interfaces/date.gateway';
import { LoggerGateway } from './interfaces/logger.gateway';
import { RouterGateway } from './interfaces/router.gateway';
import { SnackbarGateway } from './interfaces/snackbar.gateway';
import { StorageGateway } from './interfaces/storage.gateway';
import { TimerGateway } from './interfaces/timer.gateway';
import { ThreadGateway } from './thread/thread.gateway';
import { threadsReducer } from './thread/thread.slice';
import { UserGateway } from './user/user.gateway';
import { usersReducer } from './user/user.slice';

export const createStore = (dependencies: Dependencies, middlewares: Middleware[] = []) => {
  return configureStore({
    reducer: {
      [authenticationSlice.name]: authenticationSlice.reducer,
      user: userReducer,
      users: usersReducer,
      threads: threadsReducer,
      comments: commentsReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: { extraArgument: dependencies },
      }).concat(middlewares),
  });
};

export type Dependencies = {
  dateGateway: DateGateway;
  snackbarGateway: SnackbarGateway;
  loggerGateway: LoggerGateway;
  routerGateway: RouterGateway;
  timerGateway: TimerGateway;
  storageGateway: StorageGateway;
  authenticationGateway: AuthenticationGateway;
  threadGateway: ThreadGateway;
  userGateway: UserGateway;
};

export type Store = ReturnType<typeof createStore>;

export type State = ReturnType<Store['getState']>;
export type Dispatch = Store['dispatch'];

export type Selector<Params extends unknown[], Result> = RTKSelector<State, Result, Params>;

export type Thunk<Result = void | Promise<void>> = ThunkAction<Result, State, Dependencies, AnyAction>;
export type ThunkConfig = {
  state: State;
  extra: Dependencies;
};
