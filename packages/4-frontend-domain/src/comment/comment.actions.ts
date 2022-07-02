import { Comment } from '../types';

import { commentsSlice } from './comment.slice';

const { actions } = commentsSlice;

export const addComments = (comments: Comment[]) => {
  return actions.addComments(comments);
};
