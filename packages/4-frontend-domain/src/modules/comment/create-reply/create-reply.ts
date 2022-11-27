import { DraftCommentKind } from '../../../gateways/draft-messages.gateway';
import { AppThunk } from '../../../store';
import { ValidationErrors } from '../../../utils/validation-error';
import { authenticationActions } from '../../authentication';
import { handleAuthorizationError } from '../../authorization';
import { commentActions } from '../comment.actions';
import { Comment, Reply } from '../comment.types';

export const createReply = (parentId: string, text: string): AppThunk<Promise<boolean>> => {
  return async (dispatch, getState, { commentGateway, dateGateway, snackbarGateway, loggerGateway }) => {
    const user = dispatch(authenticationActions.requireAuthentication());

    if (!user) {
      return false;
    }

    text = text.trim();

    try {
      const id = await commentGateway.createReply(parentId, text);

      const reply: Reply = {
        id,
        author: {
          id: user.id,
          nick: user.nick,
          profileImage: user.profileImage,
        },
        text,
        date: dateGateway.nowAsString(),
        edited: false,
        history: [],
        upvotes: 0,
        downvotes: 0,
        editing: false,
      };

      dispatch(commentActions.addReply(parentId, reply as Comment));

      await dispatch(closeReplyForm(parentId));

      snackbarGateway.success('Votre réponse a bien été créée.');

      return true;
    } catch (error) {
      if (error instanceof ValidationErrors) {
        throw error;
      }

      if (!dispatch(handleAuthorizationError(error, 'répondre à un commentaire'))) {
        loggerGateway.error(error);
        snackbarGateway.error("Une erreur s'est produite, votre réponse n'a pas été créée.");
      }
    }

    return false;
  };
};

export const getInitialReplyText = (parentId: string, setDraft: (text: string) => void): AppThunk => {
  return async (dispatch, getState, { draftMessagesGateway }) => {
    const draft = await draftMessagesGateway.getDraftCommentText(DraftCommentKind.reply, parentId);

    setDraft(draft ?? '');
  };
};

export const saveDraftReply = (parentId: string, text: string): AppThunk => {
  return async (dispatch, getState, { draftMessagesGateway }) => {
    await draftMessagesGateway.setDraftCommentText(DraftCommentKind.reply, parentId, text);
  };
};

export const closeReplyForm = (parentId: string): AppThunk => {
  return async (dispatch, getState, { draftMessagesGateway }) => {
    dispatch(commentActions.setReplying(parentId, false));
    await draftMessagesGateway.removeDraftCommentText(DraftCommentKind.reply, parentId);
  };
};
