import { getIds } from 'shared';

import { AppState, AppThunk } from '../../../store';
import { threadActions } from '../thread.actions';
import { threadSelectors } from '../thread.selectors';

export const fetchLastThreads = (count: number): AppThunk => {
  return async (dispatch, getState, { threadGateway }) => {
    if (selectHasLastThreads(getState())) {
      return;
    }

    const threads = await threadGateway.fetchLast(count);

    dispatch(threadActions.setThreads(threads));
    dispatch(threadActions.setLastThreads(getIds(threads)));
  };
};

const selectHasLastThreads = (state: AppState) => {
  return threadSelectors.lastThreads(state).length > 0;
};
