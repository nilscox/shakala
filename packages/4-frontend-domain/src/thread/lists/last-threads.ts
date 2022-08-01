import { list } from '@nilscox/redux-query';

import { State } from '../../store';
import { selectThreads } from '../thread.selectors';

const lastThreads = list('lastThreads');

export const lastThreadsReducer = lastThreads.reducer();
const actions = lastThreads.actions();
const selectors = lastThreads.selectors((state: State) => state.threads.lastThreads);

export const setLastThreads = actions.appendMany;

export const selectLastThreads = (state: State) => {
  return selectThreads(state, selectors.selectAll(state));
};
