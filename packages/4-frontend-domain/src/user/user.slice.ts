import { combineReducers } from 'redux';

import {
  fetchUserActivitiesReducer,
  unseenNotificationsCountReducer,
  totalUserActivitiesReducer,
} from './use-cases';
import {
  fetchNotificationsReducer,
  totalNotificationsReducer,
} from './use-cases/fetch-notifications/fetch-notifications';

export const userReducer = combineReducers({
  queries: combineReducers({
    activities: fetchUserActivitiesReducer,
    notifications: fetchNotificationsReducer,
  }),
  totalActivities: totalUserActivitiesReducer,
  totalNotifications: totalNotificationsReducer,
  unseenNotificationsCount: unseenNotificationsCountReducer,
});
