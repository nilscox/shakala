import { configureStore, ThunkAction, AnyAction, Selector as RTKSelector } from '@reduxjs/toolkit';

import { AuthenticationGateway } from './authentication/authentication.gateway';
import { authenticationSlice } from './authentication/authentication.slice';
import { userSlice } from './authentication/user.slice';
import { ThreadGateway } from './thread/thread.gateway';
import { threadSlice } from './thread/thread.slice';

export const createStore = (dependencies: Dependencies) => {
  return configureStore({
    reducer: {
      [authenticationSlice.name]: authenticationSlice.reducer,
      [userSlice.name]: userSlice.reducer,
      [threadSlice.name]: threadSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: { extraArgument: dependencies },
      }),
  });
};

export type Dependencies = {
  authenticationGateway: AuthenticationGateway;
  threadGateway: ThreadGateway;
};

export type Store = ReturnType<typeof createStore>;

export type State = ReturnType<Store['getState']>;
export type Dispatch = ReturnType<Store['dispatch']>;

export type Thunk<Result = Promise<void>> = ThunkAction<Result, State, Dependencies, AnyAction>;
export type ThunkConfig = {
  state: State;
  extra: Dependencies;
};

export type Selector<Params extends unknown[], Result> = RTKSelector<State, Result, Params>;
