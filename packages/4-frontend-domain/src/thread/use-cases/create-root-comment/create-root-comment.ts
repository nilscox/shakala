import { selectUser } from '../../../authentication';
import { addComments } from '../../../comment/comment.actions';
import { Thunk } from '../../../store';
import { Comment } from '../../../types';
import { setThreadComments, setCreateCommentText, setIsCreatingComment } from '../../thread.actions';

export const createRootComment = (threadId: string, text: string): Thunk => {
  return async (dispatch, getState, { threadGateway, snackbarGateway, dateGateway }) => {
    const user = selectUser(getState());

    try {
      dispatch(setIsCreatingComment(threadId));

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
        upvotes: 0,
        downvotes: 0,
        replies: [],
        isEditing: false,
      };

      dispatch(addComments([comment]));
      dispatch(setThreadComments(threadId, [comment]));

      dispatch(setCreateCommentText(threadId, ''));

      snackbarGateway.success('Votre commentaire a bien été créé.');
    } catch (error) {
      snackbarGateway.error("Une erreur s'est produite, votre commentaire n'a pas été créé.");
    } finally {
      dispatch(setIsCreatingComment(threadId, false));
    }
  };
};
