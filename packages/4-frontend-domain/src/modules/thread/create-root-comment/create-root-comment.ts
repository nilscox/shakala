import { AppThunk } from '../../../store';
import { ValidationErrors } from '../../../utils/validation-error';
import { authenticationActions } from '../../authentication';
import { handleAuthorizationError } from '../../authorization';
import { Comment, commentActions } from '../../comment';
import { threadActions } from '../thread.actions';

export const createRootComment = (threadId: string, text: string): AppThunk<Promise<boolean>> => {
  return async (dispatch, getState, { threadGateway, dateGateway, snackbarGateway, loggerGateway }) => {
    const user = dispatch(authenticationActions.requireAuthentication());

    if (!user) {
      return false;
    }

    try {
      const commentId = await threadGateway.createComment(threadId, text);

      const comment: Comment = {
        id: commentId,
        author: {
          id: user.id,
          nick: user.nick,
          profileImage: user.profileImage,
        },
        date: dateGateway.nowAsString(),
        edited: false,
        text,
        history: [],
        upvotes: 0,
        downvotes: 0,
        replies: [],
        editing: false,
        replying: false,
      };

      dispatch(commentActions.setComment(comment));
      dispatch(threadActions.addComments(threadId, [comment]));
      await dispatch(clearDraftRootComment(threadId));

      snackbarGateway.success('Votre commentaire a bien été créé.');

      return true;
    } catch (error) {
      if (error instanceof ValidationErrors) {
        throw error;
      }

      if (!dispatch(handleAuthorizationError(error, 'créer un commentaire'))) {
        loggerGateway.error(error);
        snackbarGateway.error("Une erreur s'est produite, votre commentaire n'a pas été créé.");
      }
    }

    return false;
  };
};

export const getInitialDraftRootComment = (threadId: string, setDraft: (draft: string) => void): AppThunk => {
  return async (dispatch, getState, { draftsGateway }) => {
    const draft = await draftsGateway.getDraft('root', threadId);

    setDraft(draft ?? '');
  };
};

export const saveDraftRootComment = (threadId: string, text: string): AppThunk => {
  return async (dispatch, getState, { draftsGateway }) => {
    await draftsGateway.setDraft('root', threadId, text);
  };
};

export const clearDraftRootComment = (threadId: string): AppThunk => {
  return async (dispatch, getState, { draftsGateway }) => {
    await draftsGateway.clearDraft('root', threadId);
  };
};
