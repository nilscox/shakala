import { selectUser } from '../../../authentication';
import { Thunk } from '../../../store';
import { addThreadComment, setCreateCommentText, setIsCreatingComment } from '../../thread.actions';

export const createRootComment = (threadId: string, text: string): Thunk => {
  return async (dispatch, getState, { threadGateway, snackbarGateway, dateGateway }) => {
    const user = selectUser(getState());

    try {
      dispatch(setIsCreatingComment(threadId));

      const id = await threadGateway.createComment(threadId, text);

      dispatch(
        addThreadComment(threadId, {
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
        }),
      );

      dispatch(setCreateCommentText(threadId, ''));

      snackbarGateway.success('Votre commentaire a bien été créé.');
    } catch (error) {
      snackbarGateway.error("Une erreur s'est produite, votre commentaire n'a pas été créé.");
    } finally {
      dispatch(setIsCreatingComment(threadId, false));
    }
  };
};
