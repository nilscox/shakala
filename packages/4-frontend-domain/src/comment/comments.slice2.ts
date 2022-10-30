import { Normalized, normalized } from '@nilscox/redux-query';

import { schemas } from '../normalization';
import { Comment } from '../types';

import {
  addCommentHistoryMessage,
  setCommentEditionError,
  setCommentEditionText,
  setIsEditingComment,
  setIsReplying,
  setIsSubmittingCommentEdition,
  setIsSubmittingReply,
  setReplyFormError,
  setReplyingFormTextAction,
} from './use-cases';

export type NormalizedComment = Normalized<Comment, 'author' | 'replies'>;

export const commentsReducer = normalized<NormalizedComment>(schemas, 'comment', (comments, action) => {
  if (setIsReplying.isAction(action)) {
    return setIsReplying.reducer(comments, action);
  }

  if (setReplyingFormTextAction.isAction(action)) {
    return setReplyingFormTextAction.reducer(comments, action);
  }

  if (setIsSubmittingReply.isAction(action)) {
    return setIsSubmittingReply.reducer(comments, action);
  }

  if (setReplyFormError.isAction(action)) {
    return setReplyFormError.reducer(comments, action);
  }

  if (setIsEditingComment.isAction(action)) {
    return setIsEditingComment.reducer(comments, action);
  }

  if (setCommentEditionText.isAction(action)) {
    return setCommentEditionText.reducer(comments, action);
  }

  if (setIsSubmittingCommentEdition.isAction(action)) {
    return setIsSubmittingCommentEdition.reducer(comments, action);
  }

  if (addCommentHistoryMessage.isAction(action)) {
    return addCommentHistoryMessage.reducer(comments, action);
  }

  if (setCommentEditionError.isAction(action)) {
    return setCommentEditionError.reducer(comments, action);
  }

  return comments;
});
