import { composeWithDevTools } from '@redux-devtools/extension';
import {
  AnyAction,
  applyMiddleware,
  combineReducers,
  legacy_createStore as createReduxStore,
  Middleware,
} from 'redux';
import thunkMiddleware, { ThunkDispatch, ThunkMiddleware } from 'redux-thunk';

import { authenticationReducer } from './authentication/authentication.slice';
import { commentsReducer } from './comment/comments.slice2';
import { notificationsReducer } from './notifications/notifications.reducer';
import type { Dependencies } from './store.types';
import { lastThreadsReducer } from './thread';
import { threadsReducer } from './thread/thread.slice2';
import { authenticatedUserReducer } from './user/authenticated-user.reducer';
import { usersReducer } from './user/users.slice';

export const rootReducer = combineReducers({
  authentication: authenticationReducer,
  authenticatedUser: authenticatedUserReducer,
  users: usersReducer,
  thread: threadsReducer,
  lastThreads: lastThreadsReducer,
  comments: commentsReducer,
  notifications: notificationsReducer,
});

type State = ReturnType<typeof rootReducer>;

type AppThunkMiddleware = ThunkMiddleware<State, AnyAction, Dependencies>;
type AppThunkDispatch = ThunkDispatch<State, Dependencies, AnyAction>;

export const createStore = (
  dependencies: Dependencies,
  preloadedState?: State,
  middlewares: Middleware[] = [],
) => {
  const enhancer = applyMiddleware<AppThunkDispatch>(
    thunkMiddleware.withExtraArgument(dependencies) as AppThunkMiddleware,
    ...middlewares,
  );

  return createReduxStore(rootReducer, preloadedState, composeWithDevTools(enhancer) as typeof enhancer);
};
