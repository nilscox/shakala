import { get } from 'shared';

import { requireAuthentication } from '../../../authentication/use-cases/require-authentication/require-authentication';
import { handleAuthorizationError } from '../../../authorization/handle-authorization-error';
import { DraftCommentKind } from '../../../interfaces/storage.gateway';
import { State, Thunk } from '../../../store.types';
import { selectCommentThreadId } from '../../../thread';
import { Comment } from '../../../types';
import { selectUser } from '../../../user';
import { createEntityAction } from '../../../utils/create-entity-action';
import { serializeError } from '../../../utils/serialize-error';
import { addComment, updateComment } from '../../comments.actions';
import { selectComment, selectCommentReplies, selectIsReply } from '../../comments.selectors';
import { NormalizedComment } from '../../comments.slice2';

// actions

export const setIsReplying = createEntityAction(
  'comment/set-is-replying',
  (comment: NormalizedComment, replying: boolean) => ({
    ...comment,
    replyForm: { ...comment.replyForm, open: replying },
  }),
);

export const setReplyingFormTextAction = createEntityAction(
  'comment/set-reply-form-text',
  (comment: NormalizedComment, text: string) => ({
    ...comment,
    replyForm: { ...comment.replyForm, text },
  }),
);

export const setReplyFormError = createEntityAction(
  'comment/set-reply-form-error',
  (comment: NormalizedComment, error: unknown) => ({
    ...comment,
    replyForm: { ...comment.replyForm, error },
  }),
);

export const setIsSubmittingReply = createEntityAction(
  'comment/set-is-submitting-reply',
  (comment: NormalizedComment, submitting: boolean) => ({
    ...comment,
    replyForm: { ...comment.replyForm, submitting },
  }),
);

export const setReplyFormText = (commentId: string, text: string): Thunk => {
  return async (dispatch, getState, { storageGateway }) => {
    dispatch(setReplyingFormTextAction(commentId, text));
    await storageGateway.setDraftCommentText(DraftCommentKind.reply, commentId, text);
  };
};

export const clearReplyForm = (commentId: string): Thunk => {
  return async (dispatch, getState, { storageGateway }) => {
    // todo: clear text
    dispatch(setIsReplying(commentId, false));
    await storageGateway.removeDraftCommentText(DraftCommentKind.reply, commentId);
  };
};

// selectors

export const selectCanReply = (state: State, commentId: string) => {
  return !selectIsReply(state, commentId);
};

export const selectReplyForm = (state: State, parentId: string) => {
  return selectComment(state, parentId).replyForm;
};

export const selectIsReplying = (state: State, parentId: string) => {
  return selectReplyForm(state, parentId).open;
};

export const selectReplyFormText = (state: State, parentId: string) => {
  return selectReplyForm(state, parentId).text;
};

export const selectCanSubmitReply = (state: State, parentId: string) => {
  return selectReplyFormText(state, parentId) !== '';
};

export const selectIsSubmittingReply = (state: State, parentId: string) => {
  return selectComment(state, parentId).replyForm.submitting;
};

export const selectCreateReplyError = (state: State, parentId: string) => {
  return get(selectReplyForm(state, parentId).error, 'message');
};

export const createReply = (parentId: string): Thunk => {
  return async (dispatch, getState, { threadGateway, snackbarGateway, dateGateway, loggerGateway }) => {
    if (!dispatch(requireAuthentication())) {
      return;
    }

    const threadId = selectCommentThreadId(getState(), parentId);
    const text = selectReplyFormText(getState(), parentId) as string;
    const user = selectUser(getState());

    try {
      dispatch(setIsSubmittingReply(parentId, true));

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
        replyForm: {
          open: false,
          text: '',
          submitting: false,
        },
        editionForm: {
          open: false,
          text: '',
          submitting: false,
        },
      };

      dispatch(addComment(reply));
      dispatch(addCommentReply(parentId, reply));

      await dispatch(clearReplyForm(parentId));

      snackbarGateway.success('Votre réponse a bien été créée.');
    } catch (error) {
      dispatch(setReplyFormError(parentId, serializeError(error)));

      if (!dispatch(handleAuthorizationError(error, 'répondre à un commentaire'))) {
        loggerGateway.error(error);
        snackbarGateway.error("Une erreur s'est produite, votre réponse n'a pas été créée.");
      }
    } finally {
      dispatch(setIsSubmittingReply(parentId, false));
    }
  };
};

const addCommentReply = (commentId: string, reply: Comment): Thunk => {
  return (dispatch, getState) => {
    const replies = selectCommentReplies(getState(), commentId);

    dispatch(updateComment(commentId, { replies: [...replies, reply] }));
  };
};
