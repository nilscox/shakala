import { list } from '@nilscox/redux-query';

import { State } from '../../store.types';
import { selectThreads } from '../thread.selectors';

const lastThreads = list('lastThreads');

export const lastThreadsReducer = lastThreads.reducer();
const actions = lastThreads.actions();
const selectors = lastThreads.selectors((state: State) => state.lastThreads);

export const setLastThreads = actions.appendMany;

export const selectLastThreads = (state: State) => {
  return selectThreads(state, selectors.selectAll(state));
};
