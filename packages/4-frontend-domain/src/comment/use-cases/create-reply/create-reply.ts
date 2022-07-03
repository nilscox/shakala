import { selectUser } from '../../../authentication';
import { Thunk } from '../../../store';
import { Comment } from '../../../types';
import { addCommentReply, addComments, setIsReplying, setIsSubmittingReply } from '../../comments.actions';
import { selectReplyFormText } from '../../comments.selectors';

export const createReply = (threadId: string, parentId: string): Thunk => {
  return async (dispatch, getState, { threadGateway, snackbarGateway, dateGateway }) => {
    const text = selectReplyFormText(getState(), parentId) as string;
    const user = selectUser(getState());

    try {
      dispatch(setIsSubmittingReply(parentId));

      const id = await threadGateway.createReply(threadId, parentId, text);

      const reply: Comment = {
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

      dispatch(addComments([reply]));
      dispatch(addCommentReply(parentId, reply));

      dispatch(setIsReplying(parentId, false));

      snackbarGateway.success('Votre réponse a bien été créée.');
    } catch (error) {
      snackbarGateway.error("Une erreur s'est produite, votre réponse n'a pas été créée.");
    } finally {
      dispatch(setIsSubmittingReply(parentId, false));
    }
  };
};
