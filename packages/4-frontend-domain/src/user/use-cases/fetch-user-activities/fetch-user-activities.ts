import { Thunk } from '../../../store.types';
import { addUserActivities, setTotalUserActivities } from '../../user.actions';

export const fetchUserActivities = (page: number): Thunk<Promise<void>> => {
  return async (dispatch, getState, { userGateway }) => {
    const { items: activities, total } = await userGateway.listActivities(page);

    dispatch(addUserActivities(activities));
    dispatch(setTotalUserActivities(total));
  };
};
