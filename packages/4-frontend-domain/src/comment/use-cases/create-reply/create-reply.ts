import { query, QueryState } from '@nilscox/redux-query';

import { selectUserOrFail } from '../../../authentication';
import { requireAuthentication } from '../../../authentication/use-cases/require-authentication/require-authentication';
import type { State, Thunk } from '../../../store';
import { selectCommentThreadId } from '../../../thread';
import { Comment } from '../../../types';
import { serializeError } from '../../../utils/serialize-error';
import { addComment, updateComment } from '../../comments.actions';
import { selectComment, selectCommentReplies, selectIsReply } from '../../comments.selectors';

type Key = {
  parentId: string;
};

const createReplyMutation = query<Key, undefined>('createReply');

export const createReplyReducer = createReplyMutation.reducer();

const actions = createReplyMutation.actions();
const selectors = createReplyMutation.selectors((state: State) => state.comments.mutations.createReply);

export const setIsReplying = (commentId: string, isReplying = true) => {
  return updateComment(commentId, { replyForm: isReplying ? { text: '' } : undefined });
};

export const setReplyFormText = (commentId: string, text: string) => {
  return updateComment(commentId, { replyForm: { text } });
};

export const selectCanReply = (state: State, commentId: string) => {
  return !selectIsReply(state, commentId);
};

export const selectReplyForm = (state: State, parentId: string) => {
  return selectComment(state, parentId).replyForm;
};

export const selectIsReplying = (state: State, parentId: string) => {
  return selectReplyForm(state, parentId) !== undefined;
};

export const selectReplyFormText = (state: State, parentId: string) => {
  return selectReplyForm(state, parentId)?.text;
};

export const selectCanSubmitReply = (state: State, parentId: string) => {
  return selectReplyFormText(state, parentId) !== '';
};

export const selectIsSubmittingReply = (state: State, parentId: string) => {
  return selectors.selectState(state, { parentId }) === QueryState.pending;
};

export const selectCreateReplyError = (state: State, parentId: string) => {
  return selectors.selectError(state, { parentId });
};

export const createReply = (parentId: string): Thunk => {
  return async (dispatch, getState, { threadGateway, snackbarGateway, dateGateway, loggerGateway }) => {
    if (!dispatch(requireAuthentication())) {
      return;
    }

    const key: Key = { parentId };

    const threadId = selectCommentThreadId(getState(), parentId);
    const text = selectReplyFormText(getState(), parentId) as string;
    const user = selectUserOrFail(getState());

    try {
      dispatch(actions.setPending(key));

      const id = await threadGateway.createReply(threadId, parentId, text);

      const reply: Comment = {
        id,
        author: {
          id: user.id,
          nick: user.nick,
          profileImage: user.profileImage,
        },
        text,
        date: dateGateway.now().toISOString(),
        edited: false,
        history: [],
        upvotes: 0,
        downvotes: 0,
        replies: [],
      };

      dispatch(addComment(reply));
      dispatch(addCommentReply(parentId, reply));

      dispatch(setIsReplying(parentId, false));

      dispatch(actions.setSuccess(key, undefined));

      snackbarGateway.success('Votre réponse a bien été créée.');
    } catch (error) {
      dispatch(actions.setError(key, serializeError(error)));

      loggerGateway.error(error);
      snackbarGateway.error("Une erreur s'est produite, votre réponse n'a pas été créée.");
    }
  };
};

const addCommentReply = (commentId: string, reply: Comment): Thunk => {
  return (dispatch, getState) => {
    const replies = selectCommentReplies(getState(), commentId);

    dispatch(updateComment(commentId, { replies: [...replies, reply] }));
  };
};
