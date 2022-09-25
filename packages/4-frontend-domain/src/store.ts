import {
  AnyAction,
  applyMiddleware,
  combineReducers,
  legacy_createStore as createReduxStore,
  Middleware,
} from 'redux';
import thunkMiddleware, { ThunkDispatch, ThunkMiddleware } from 'redux-thunk';

import { authenticationReducer } from './authentication/authentication.slice';
import { commentsReducer } from './comment/comments.slice';
import type { Dependencies } from './store.types';
import { threadsReducer } from './thread/thread.slice';
import { userReducer } from './user/user.slice';
import { usersReducer } from './user/users.slice';

const rootReducer = combineReducers({
  authentication: authenticationReducer,
  user: userReducer,
  users: usersReducer,
  threads: threadsReducer,
  comments: commentsReducer,
});

type State = ReturnType<typeof rootReducer>;

type AppThunkMiddleware = ThunkMiddleware<State, AnyAction, Dependencies>;
type AppThunkDispatch = ThunkDispatch<State, Dependencies, AnyAction>;

export const createStore = (dependencies: Dependencies, middlewares: Middleware[] = []) => {
  return createReduxStore(
    rootReducer,
    applyMiddleware<AppThunkDispatch>(
      thunkMiddleware.withExtraArgument(dependencies) as AppThunkMiddleware,
      ...middlewares,
    ),
  );
};
