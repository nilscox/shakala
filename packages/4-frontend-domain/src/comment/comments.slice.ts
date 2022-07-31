import { Normalized, normalized } from '@nilscox/redux-query';
import { combineReducers } from '@reduxjs/toolkit';

import { schemas } from '../normalization';
import { Comment } from '../types';

import { createReplyReducer, editCommentReducer } from './use-cases';

type NormalizedComment = Normalized<Comment, 'author' | 'replies'>;

export const commentsReducer = combineReducers({
  entities: normalized<NormalizedComment>(schemas, 'comment'),
  mutations: combineReducers({
    createReply: createReplyReducer,
    editComment: editCommentReducer,
  }),
});
