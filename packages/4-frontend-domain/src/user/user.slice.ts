import { combineReducers } from 'redux';

import { fetchAuthenticatedUserReducer } from './use-cases/fetch-authenticated-user/fetch-authenticated-user';

export const userReducer = combineReducers({
  queries: combineReducers({
    fetchAuthenticatedUser: fetchAuthenticatedUserReducer,
  }),
});
