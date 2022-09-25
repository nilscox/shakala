import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { AuthenticationGateway } from './authentication';
import { DateGateway } from './interfaces/date.gateway';
import { LoggerGateway } from './interfaces/logger.gateway';
import { RouterGateway } from './interfaces/router.gateway';
import { SnackbarGateway } from './interfaces/snackbar.gateway';
import { StorageGateway } from './interfaces/storage.gateway';
import { TimerGateway } from './interfaces/timer.gateway';
import type { createStore } from './store';
import { ThreadGateway } from './thread';
import { UserGateway } from './user';

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

export type Selector<Params extends unknown[], Result> = (state: State, ...params: Params) => Result;

export type Thunk<Result = void | Promise<void>> = ThunkAction<Result, State, Dependencies, AnyAction>;
