import { Normalized, normalized } from '@nilscox/redux-query';
import { combineReducers } from '@reduxjs/toolkit';

import { schemas } from '../normalization';
import { Thread } from '../types';

import { createdRootCommentsReducer } from './lists/created-root-comments';
import { lastThreadsReducer } from './lists/last-threads';
import { createRootCommentQueryReducer, getThreadQueryReducer } from './use-cases';

type NormalizedThread = Normalized<Thread, 'author' | 'comments'>;

export const threadsReducer = combineReducers({
  entities: normalized<NormalizedThread>(schemas, 'thread'),
  lastThreads: lastThreadsReducer,
  createdRootComments: createdRootCommentsReducer,
  queries: combineReducers({
    getThread: getThreadQueryReducer,
  }),
  mutations: combineReducers({
    createRootComment: createRootCommentQueryReducer,
  }),
});
