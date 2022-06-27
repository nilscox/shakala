import {
  AnyAction,
  configureStore,
  Selector as RTKSelector,
  ThunkAction,
  ThunkDispatch,
} from '@reduxjs/toolkit';

import { AuthenticationGateway } from './authentication/authentication.gateway';
import { authenticationSlice } from './authentication/authentication.slice';
import { userSlice } from './authentication/user.slice';
import { DateGateway } from './interfaces/date.gateway';
import { LoggerGateway } from './interfaces/logger.gateway';
import { RouterGateway } from './interfaces/router.gateway';
import { SnackbarGateway } from './interfaces/snackbar.gateway';
import { TimerGateway } from './interfaces/timer.gateway';
import { ThreadGateway } from './thread/thread.gateway';
import { threadsSlice } from './thread/thread.slice';

export const createStore = (dependencies: Dependencies) => {
  return configureStore({
    reducer: {
      [authenticationSlice.name]: authenticationSlice.reducer,
      [userSlice.name]: userSlice.reducer,
      [threadsSlice.name]: threadsSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: { extraArgument: dependencies },
      }),
  });
};

export type Dependencies = {
  dateGateway: DateGateway;
  snackbarGateway: SnackbarGateway;
  loggerGateway: LoggerGateway;
  routerGateway: RouterGateway;
  timerGateway: TimerGateway;
  authenticationGateway: AuthenticationGateway;
  threadGateway: ThreadGateway;
};

export type Store = ReturnType<typeof createStore>;

export type State = ReturnType<Store['getState']>;
export type Dispatch = ThunkDispatch<State, Dependencies, AnyAction>;

export type Thunk<Result = void | Promise<void>> = ThunkAction<Result, State, Dependencies, AnyAction>;
export type ThunkConfig = {
  state: State;
  extra: Dependencies;
};

export type Selector<Params extends unknown[], Result> = RTKSelector<State, Result, Params>;
