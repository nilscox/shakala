import { createAction, createNormalizedActions } from '@nilscox/redux-query';

import { Comment } from '../types';

export const {
  setEntity: addComment,
  setEntities: addComments,
  updateEntity: updateComment,
} = createNormalizedActions<Comment>('comment');

export const setCommentText = (commentId: string, text: string) => {
  return updateComment(commentId, { text });
};

export const setCommentEdited = (commentId: string, edited: string) => {
  return updateComment(commentId, { edited });
};

export const [addCommentHistoryMessage, isAddCommentHistoryMessageAction] = createAction(
  'comment/add-history-message',
  (commentId: string, text: string, date: string) => ({
    commentId,
    text,
    date,
  }),
);
