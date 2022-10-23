import { combineReducers } from 'redux';

import { fetchUserActivitiesReducer, totalUserActivitiesReducer } from './use-cases';
import { fetchAuthenticatedUserReducer } from './use-cases/fetch-authenticated-user/fetch-authenticated-user';

export const userReducer = combineReducers({
  queries: combineReducers({
    authenticatedUser: fetchAuthenticatedUserReducer,
    activities: fetchUserActivitiesReducer,
  }),
  totalActivities: totalUserActivitiesReducer,
});
