import { query, QueryState } from '@nilscox/redux-query';

import { selectUserOrFail } from '../../../authentication';
import { requireAuthentication } from '../../../authentication/use-cases';
import { addComment } from '../../../comment/comments.actions';
import type { State, Thunk } from '../../../store';
import { Comment } from '../../../types';
import { addCreatedRootComment } from '../../lists/created-root-comments';
import { updateThread } from '../../thread.actions';
import { selectThread } from '../../thread.selectors';

type Key = {
  threadId: string;
};

const createRootCommentQuery = query<Key, undefined>('createRootComment');

export const createRootCommentQueryReducer = createRootCommentQuery.reducer();

const actions = createRootCommentQuery.actions();
const selectors = createRootCommentQuery.selectors(
  (state: State) => state.threads.mutations.createRootComment,
);

export const setCreateRootCommentText = (threadId: string, text: string) => {
  return updateThread(threadId, { createCommentForm: { text } });
};

export const selectCreateRootCommentFormText = (state: State, threadId: string) => {
  return selectThread(state, threadId).createCommentForm.text;
};

export const selectCanSubmitRootComment = (state: State, threadId: string) => {
  return selectCreateRootCommentFormText(state, threadId) !== '';
};

export const selectIsSubmittingRootCommentForm = (state: State, threadId: string) => {
  return selectors.selectState(state, { threadId }) === QueryState.pending;
};

export const createRootComment = (threadId: string): Thunk => {
  return async (dispatch, getState, { threadGateway, snackbarGateway, dateGateway }) => {
    if (!dispatch(requireAuthentication())) {
      return;
    }

    const text = selectCreateRootCommentFormText(getState(), threadId);
    const user = selectUserOrFail(getState());

    const key: Key = { threadId };

    try {
      dispatch(actions.setPending(key));

      const id = await threadGateway.createComment(threadId, text);

      const comment: Comment = {
        id,
        author: {
          id: user.id,
          nick: user.nick,
          profileImage: user.profileImage,
        },
        text,
        date: dateGateway.now().toISOString(),
        edited: false,
        upvotes: 0,
        downvotes: 0,
        replies: [],
      };

      dispatch(addComment(comment));
      dispatch(addCreatedRootComment(comment));
      dispatch(setCreateRootCommentText(threadId, ''));

      dispatch(actions.setSuccess(key, undefined));
      snackbarGateway.success('Votre commentaire a bien été créé.');
    } catch (error) {
      // todo: serialize error
      // dispatch(actions.setError(key, error));
      snackbarGateway.error("Une erreur s'est produite, votre commentaire n'a pas été créé.");
    }
  };
};
