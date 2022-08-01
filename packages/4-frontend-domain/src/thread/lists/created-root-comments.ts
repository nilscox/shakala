import { list } from '@nilscox/redux-query';

import { selectComments } from '../../comment/comments.selectors';
import type { State } from '../../store';
import { Comment } from '../../types';

const createdRootCommentsList = list('createdRootComment');

export const createdRootCommentsReducer = createdRootCommentsList.reducer();
const actions = createdRootCommentsList.actions();
const selectors = createdRootCommentsList.selectors((state: State) => state.threads.createdRootComments);

export const clearCreatedRootComments = actions.clear;

export const addCreatedRootComment = (comment: Comment) => {
  return actions.append(comment.id);
};

export const selectCreatedRootComments = (state: State) => {
  return selectComments(state, selectors.selectAll(state));
};
