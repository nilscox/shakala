import { selectUser } from '../../../authentication';
import { requireAuthentication } from '../../../authentication/use-cases/require-authentication/require-authentication';
import { addComments } from '../../../comment/comments.actions';
import { Thunk } from '../../../store';
import { Comment } from '../../../types';
import { addThreadComment, setCreateRootCommentText, setIsCreatingRootComment } from '../../thread.actions';
import { selectRootCommentFormText } from '../../thread.selectors';

export const createRootComment = (threadId: string): Thunk => {
  return async (dispatch, getState, { threadGateway, snackbarGateway, dateGateway }) => {
    if (!dispatch(requireAuthentication())) {
      return;
    }

    const text = selectRootCommentFormText(getState(), threadId);
    const user = selectUser(getState());

    try {
      dispatch(setIsCreatingRootComment(threadId));

      const id = await threadGateway.createComment(threadId, text);

      const comment: Comment = {
        id,
        author: {
          id: user!.id,
          nick: user!.nick,
          profileImage: user!.profileImage,
        },
        text,
        date: dateGateway.now().toISOString(),
        edited: false,
        upvotes: 0,
        downvotes: 0,
        replies: [],
      };

      dispatch(addComments([comment]));
      dispatch(addThreadComment(threadId, comment));

      dispatch(setCreateRootCommentText(threadId, ''));

      snackbarGateway.success('Votre commentaire a bien été créé.');
    } catch (error) {
      snackbarGateway.error("Une erreur s'est produite, votre commentaire n'a pas été créé.");
    } finally {
      dispatch(setIsCreatingRootComment(threadId, false));
    }
  };
};
