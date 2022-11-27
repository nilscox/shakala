import { AppThunk } from '../../../store';
import { userActivityActions } from '../user-activity.actions';

export const fetchUserActivities = (page = 1): AppThunk => {
  return async (dispatch, getState, { userProfileGateway }) => {
    dispatch(userActivityActions.setFetching(true));

    try {
      const { items: activities, total } = await userProfileGateway.fetchActivities(page);

      dispatch(userActivityActions.addMany(activities));
      dispatch(userActivityActions.setTotal(total));
    } catch (error) {
      dispatch(userActivityActions.setError(error));
    } finally {
      dispatch(userActivityActions.setFetching(true));
    }
  };
};
