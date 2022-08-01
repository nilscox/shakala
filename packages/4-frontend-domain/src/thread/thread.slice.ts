import { Normalized, normalized } from '@nilscox/redux-query';
import { combineReducers } from '@reduxjs/toolkit';

import { schemas } from '../normalization';
import { Thread } from '../types';

import { createRootCommentQueryReducer, getThreadQueryReducer } from './use-cases';

type NormalizedThread = Normalized<Thread, 'author' | 'comments'>;

export const threadsReducer = combineReducers({
  entities: normalized<NormalizedThread>(schemas, 'thread'),
  queries: combineReducers({
    getThread: getThreadQueryReducer,
  }),
  mutations: combineReducers({
    createRootComment: createRootCommentQueryReducer,
  }),
});
