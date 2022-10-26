import { combineReducers } from 'redux';

import {
  fetchUserActivitiesReducer,
  unseenNotificationsCountReducer,
  totalUserActivitiesReducer,
} from './use-cases';
import { fetchAuthenticatedUserReducer } from './use-cases/fetch-authenticated-user/fetch-authenticated-user';
import {
  fetchNotificationsReducer,
  totalNotificationsReducer,
} from './use-cases/fetch-notifications/fetch-notifications';

export const userReducer = combineReducers({
  queries: combineReducers({
    authenticatedUser: fetchAuthenticatedUserReducer,
    activities: fetchUserActivitiesReducer,
    notifications: fetchNotificationsReducer,
  }),
  totalActivities: totalUserActivitiesReducer,
  totalNotifications: totalNotificationsReducer,
  unseenNotificationsCount: unseenNotificationsCountReducer,
});
